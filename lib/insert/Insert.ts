import { AbstractScopeNode, Cursor, TemplateElement, eol, keyword, printChain, tab, _ } from "abstract-lang";
import { Select, SelectColumn, TableReference, ValueRow, With } from "../select";
import { Name } from "../base";
import { OnConflict } from "./OnConflict";

// https://www.postgresql.org/docs/10/sql-insert.html

/*
[ WITH [ RECURSIVE ] with_query [, ...] ]
INSERT INTO table_name [ AS alias ] [ ( column_name [, ...] ) ]
    { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
    [ ON CONFLICT [ conflict_target ] conflict_action ]
    [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

where conflict_target can be one of:

    ( { index_column_name | ( index_expression ) } [ COLLATE collation ] [ opclass ] [, ...] ) [ WHERE index_predicate ]
    ON CONSTRAINT constraint_name

and conflict_action is one of:

    DO NOTHING
    DO UPDATE SET { column_name = { expression | DEFAULT } |
                    ( column_name [, ...] ) = ( { expression | DEFAULT } [, ...] ) |
                    ( column_name [, ...] ) = ( sub-SELECT )
                  } [, ...]
              [ WHERE condition ]
 */

export interface InsertRow {
    with?: With;
    into: TableReference;
    as?: Name;
    columns?: Name[];
    values: "default" | ValueRow[] | Select;
    onConflict?: OnConflict;
    returning?: SelectColumn[];
}

export class Insert extends AbstractScopeNode<InsertRow> {

    static entry(cursor: Cursor): boolean {
        if ( cursor.beforeWord("insert") ) {
            return true;
        }

        if ( cursor.before(With) ) {
            const startToken = cursor.nextToken;
            cursor.parse(With);
            cursor.skipSpaces();

            const isInsert = cursor.beforeWord("insert");
            cursor.setPositionBefore(startToken);

            return isInsert;
        }

        return false;
    }

    static parse(cursor: Cursor): InsertRow {
        const with_ = this.parseWith(cursor);

        cursor.readPhrase("insert", "into");

        const into = cursor.parse(TableReference);
        cursor.skipSpaces();

        const as = this.parseAlias(cursor);

        const columns = this.parseColumns(cursor);
        const values = this.parseValues(cursor);
        const onConflict = this.parseOnConflict(cursor);
        const returning = this.parseReturning(cursor);

        return {
            with: with_,
            into, as,
            columns,
            values,
            onConflict,
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

    private static parseAlias(cursor: Cursor) {
        if ( !cursor.beforeWord("as") ) return;

        cursor.readWord("as");
        const as = cursor.parse(Name);
        cursor.skipSpaces();

        return as;
    }

    private static parseColumns(cursor: Cursor) {
        if ( !cursor.beforeValue("(") ) return;

        cursor.readValue("(");
        cursor.skipSpaces();

        const columns = cursor.parseChainOf(Name, ",");

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        return columns;
    }

    private static parseValues(cursor: Cursor) {
        if ( cursor.beforeWord("default") ) {
            cursor.readPhrase("default", "values");
            return "default";
        }

        if ( cursor.before(Select) ) {
            return cursor.parse(Select);
        }

        cursor.readWord("values");
        const values = cursor.parseChainOf(ValueRow, ",");
        cursor.skipSpaces();

        return values;
    }

    private static parseOnConflict(cursor: Cursor) {
        if ( !cursor.before(OnConflict) ) return;

        const onConflict = cursor.parse(OnConflict);
        cursor.skipSpaces();

        return onConflict;
    }

    private static parseReturning(cursor: Cursor) {
        if ( !cursor.beforeWord("returning") ) return;

        cursor.readWord("returning");
        return cursor.parseChainOf(SelectColumn, ",");
    }


    template(): TemplateElement[] {
        const insert = this.row;
        const output: TemplateElement[] = [];

        if ( insert.with ) {
            output.push(insert.with, eol);
        }

        output.push(keyword("insert"), keyword("into"), insert.into);
        if ( insert.as ) {
            output.push(keyword("as"), insert.as);
        }

        if ( insert.columns ) {
            output.push(_, "(", eol);
            output.push(tab, ...printChain(insert.columns, ",", eol, tab), eol);
            output.push(")");
        }

        output.push(eol);
        if ( insert.values === "default" ) {
            output.push(keyword("default"), keyword("values"));
        }
        else if ( insert.values instanceof Select ) {
            output.push(insert.values);
        }
        else {
            output.push(keyword("values"), eol);
            output.push(tab, ...printChain(insert.values, ",", eol, tab));
        }

        if ( insert.onConflict ) {
            output.push(eol, insert.onConflict);
        }

        if ( insert.returning ) {
            output.push(
                eol, keyword("returning"), eol,
                tab, ...printChain(insert.returning, ",", eol, tab)
            );
        }

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    hasClojure(): boolean {
        return true;
    }
}