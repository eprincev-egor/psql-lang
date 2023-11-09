import { AbstractScopeNode, Cursor, TemplateElement, _, eol, keyword, printChain, tab } from "abstract-lang";
import { FromItemType, SelectColumn, TableReference, With, parseFromItems } from "../select";
import { Expression, Operand } from "../expression";
import { Name } from "../base";
import { SetItem } from "./SetItem";

// https://www.postgresql.org/docs/10/sql-update.html
/*
[ WITH [ RECURSIVE ] with_query [, ...] ]
UPDATE [ ONLY ] table_name [ * ] [ [ AS ] alias ]
    SET { column_name = { expression | DEFAULT } |
          ( column_name [, ...] ) = [ ROW ] ( { expression | DEFAULT } [, ...] ) |
          ( column_name [, ...] ) = ( sub-SELECT )
        } [, ...]
    [ FROM from_item [, ...] ]
    [ WHERE condition | WHERE CURRENT OF cursor_name ]
    [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]
*/
export interface UpdateRow {
    with?: With;
    only: boolean;
    all: boolean;
    update: TableReference;
    as?: Name;
    set: SetItem[];
    from: FromItemType[];
    where?: Operand;
    returning: SelectColumn[];
}

export class Update extends AbstractScopeNode<UpdateRow> {

    static entry(cursor: Cursor): boolean {
        if ( cursor.beforeWord("update") ) {
            return true;
        }

        if ( cursor.before(With) ) {
            const startToken = cursor.nextToken;
            cursor.parse(With);
            cursor.skipSpaces();

            const isUpdate = cursor.beforeWord("update");
            cursor.setPositionBefore(startToken);

            return isUpdate;
        }

        return false;
    }

    static parse(cursor: Cursor): UpdateRow {
        return {
            with: this.parseWith(cursor),
            ...this.parseMain(cursor),
            set: this.parseSet(cursor),
            from: this.parseFrom(cursor),
            where: this.parseWhere(cursor),
            returning: this.parseReturning(cursor)
        };
    }

    private static parseWith(cursor: Cursor) {
        if ( !cursor.before(With) ) {
            return;
        }
        const with_ = cursor.parse(With);

        cursor.skipSpaces();
        return with_;
    }

    private static parseMain(cursor: Cursor) {
        cursor.readWord("update");

        const only = this.parseOnly(cursor);

        const update = cursor.parse(TableReference);
        cursor.skipSpaces();

        return {
            only, update,
            all: this.parseAll(cursor),
            as: this.parseAlias(cursor)
        };
    }

    private static parseOnly(cursor: Cursor) {
        if ( cursor.beforeWord("only") ) {
            cursor.readWord("only");
            return true;
        }
        return false;
    }

    private static parseAll(cursor: Cursor) {
        if ( cursor.beforeValue("*") ) {
            cursor.readValue("*");
            cursor.skipSpaces();
            return true;
        }
        return false;
    }

    private static parseAlias(cursor: Cursor) {
        if ( !cursor.beforeWord("as") ) {
            return;
        }

        cursor.readWord("as");
        const alias = cursor.parse(Name);

        cursor.skipSpaces();
        return alias;
    }

    private static parseSet(cursor: Cursor) {
        cursor.readWord("set");

        const set = cursor.parseChainOf(SetItem, ",");
        cursor.skipSpaces();

        return set;
    }

    private static parseFrom(cursor: Cursor) {
        if ( !cursor.beforeWord("from") ) {
            return [];
        }

        cursor.readWord("from");
        const from = parseFromItems(cursor);

        cursor.skipSpaces();
        return from;
    }

    private static parseWhere(cursor: Cursor) {
        if ( !cursor.beforeWord("where") ) {
            return;
        }

        cursor.readWord("where");
        const where = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        return where;
    }

    private static parseReturning(cursor: Cursor) {
        if ( !cursor.beforeWord("returning") ) {
            return [];
        }

        cursor.readWord("returning");
        return cursor.parseChainOf(SelectColumn, ",");
    }


    template(): TemplateElement[] {
        const update = this.row;
        const output: TemplateElement[] = [];

        if ( update.with ) {
            output.push(update.with, eol);
        }

        output.push(keyword("update"));

        if ( update.only ) {
            output.push(keyword("only"));
        }

        output.push(this.row.update);

        if ( update.all ) {
            output.push(" * ");
        }

        if ( update.as ) {
            output.push(keyword("as"), update.as);
        }

        output.push(keyword("set"), eol);

        output.push(tab, ...printChain(update.set, ",", eol, tab), eol);

        if ( update.from.length > 0 ) {
            output.push(keyword("from"), ...printChain(update.from, ",", _), eol);
        }

        if ( update.where ) {
            output.push(keyword("where"), eol);
            output.push(tab, update.where, eol);
        }

        if ( update.returning.length > 0 ) {
            output.push(keyword("returning"), ...printChain(update.returning, ",", _));
        }

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    hasClojure(): boolean {
        return true;
    }
}