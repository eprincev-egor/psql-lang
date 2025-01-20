import { AbstractScopeNode, Cursor, TemplateElement, eol, keyword, printChain, tab, _ } from "abstract-lang";
import { FromItemType, parseFromItems, SelectColumn, TableReference, With } from "../select";
import { Name } from "../base";
import { Expression, Operand } from "../expression";

// https://www.postgresql.org/docs/10/sql-insert.html

/*
[ WITH [ RECURSIVE ] with_query [, ...] ]
DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
    [ USING from_item [, ...] ]
    [ WHERE condition | WHERE CURRENT OF cursor_name ]
    [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]
 */

export interface DeleteRow {
    with?: With;
    star?: boolean;
    only?: boolean;
    delete: TableReference;
    as?: Name;
    where?: Operand;
    using?: FromItemType[];
    returning?: SelectColumn[];
}

export class Delete extends AbstractScopeNode<DeleteRow> {

    static entry(cursor: Cursor): boolean {
        if ( cursor.beforeWord("delete") ) {
            return true;
        }

        if ( cursor.before(With) ) {
            const startToken = cursor.nextToken;
            cursor.parse(With);
            cursor.skipSpaces();

            const isInsert = cursor.beforeWord("delete");
            cursor.setPositionBefore(startToken);

            return isInsert;
        }

        return false;
    }

    static parse(cursor: Cursor): DeleteRow {
        const with_ = this.parseWith(cursor);

        cursor.readPhrase("delete", "from");

        const only = this.parseOnly(cursor);

        const deleteTable = cursor.parse(TableReference);
        cursor.skipSpaces();

        const star = this.parseStar(cursor);
        const as = this.parseAlias(cursor);

        const using = this.parseUsing(cursor);
        const where = this.parseWhere(cursor);

        const returning = this.parseReturning(cursor);

        return {
            with: with_,
            delete: deleteTable, as,
            only, star,
            using,
            where,
            returning
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

    private static parseOnly(cursor: Cursor) {
        if ( cursor.beforeWord("only") ) {
            cursor.readWord("only");
            return true;
        }
    }

    private static parseStar(cursor: Cursor) {
        if ( cursor.beforeValue("*") ) {
            cursor.readValue("*");
            cursor.skipSpaces();
            return true;
        }
    }

    private static parseAlias(cursor: Cursor) {
        if ( !cursor.beforeWord("as") ) return;

        cursor.readWord("as");
        const as = cursor.parse(Name);
        cursor.skipSpaces();

        return as;
    }

    private static parseUsing(cursor: Cursor) {
        if ( !cursor.beforeWord("using") ) return;

        cursor.readWord("using");
        return parseFromItems(cursor);
    }

    private static parseWhere(cursor: Cursor) {
        if ( !cursor.beforeWord("where") ) return;

        cursor.readWord("where");
        const where = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        return where;
    }

    private static parseReturning(cursor: Cursor) {
        if ( !cursor.beforeWord("returning") ) return;

        cursor.readWord("returning");
        return cursor.parseChainOf(SelectColumn, ",");
    }


    template(): TemplateElement[] {
        const delete_ = this.row;
        const output: TemplateElement[] = [];

        if ( delete_.with ) {
            output.push(delete_.with, eol);
        }

        output.push(keyword("delete"), keyword("from"));

        if ( delete_.only ) {
            output.push(keyword("only"));
        }

        output.push(delete_.delete);

        if ( delete_.star ) {
            output.push(_, "*");
            if ( delete_.as ) {
                output.push(_);
            }
        }

        if ( delete_.as ) {
            output.push(keyword("as"), delete_.as);
        }

        if ( delete_.using ) {
            output.push(eol, keyword("using"), eol);
            output.push(tab, ...printChain(delete_.using, ",", eol, tab));
        }

        if ( delete_.where ) {
            output.push(eol, keyword("where"), eol);
            output.push(tab, delete_.where);
        }

        if ( delete_.returning ) {
            output.push(
                eol, keyword("returning"), eol,
                tab, ...printChain(delete_.returning, ",", eol, tab)
            );
        }

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    hasClojure(): boolean {
        return true;
    }
}