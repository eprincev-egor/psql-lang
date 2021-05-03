import {
    AbstractNode, Cursor,
    TemplateElement,
    keyword, tab, eol, _, printChain
} from "abstract-lang";
import { Name } from "../base";
import { Select } from "./Select";
import { ValueRow } from "./ValueRow";

export type WithQueryRow = {
    name: Name;
    columns?: Name[];
    query: Select;
} | {
    name: Name;
    columns?: Name[];
    values: ValueRow[];
}

export class WithQuery extends AbstractNode<WithQueryRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): WithQueryRow {
        const row: {
            name: Name;
            columns?: Name[];
            query?: Select;
            values?: ValueRow[];
        } = {
            name: cursor.parse(Name)
        };

        cursor.skipSpaces();
        if ( cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();

            row.columns = cursor.parseChainOf(Name, ",");

            cursor.skipSpaces();
            cursor.readValue(")");
            cursor.skipSpaces();
        }

        cursor.readWord("as");
        cursor.readValue("(");
        cursor.skipSpaces();

        if ( cursor.beforeWord("values") ) {
            cursor.readWord("values");

            row.values = cursor.parseChainOf(ValueRow, ",");
        }
        else {
            row.query = cursor.parse(Select);
        }

        cursor.skipSpaces();
        cursor.readValue(")");

        this.validate(cursor, row as WithQueryRow);
        return row as WithQueryRow;
    }

    private static validate(cursor: Cursor, row: WithQueryRow) {
        if ( !("values" in row) ) {
            return;
        }

        const firstRow = row.values[0];
        for (let i = 1, n = row.values.length; i < n; i++) {
            const nextRow = row.values[i];

            if ( nextRow.row.values.length !== firstRow.row.values.length ) {
                cursor.throwError(
                    "VALUES lists must all be the same length",
                    nextRow
                );
            }

            for (const child of nextRow.children) {
                if ( "default" in child.row ) {
                    cursor.throwError(
                        "DEFAULT is not allowed in this context",
                        child
                    );
                }
            }
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        output.push(this.row.name);

        if ( this.row.columns ) {
            output.push(
                _, "(",
                ...printChain(this.row.columns, ",", _),
                ")", _
            );
        }

        output.push(
            keyword("as"), _, "(", eol
        );

        if ( "query" in this.row ) {
            output.push(
                tab, this.row.query, eol
            );
        }
        else {
            output.push(
                tab, keyword("values"), eol,
                tab, tab, ...printChain(
                    this.row.values, ",", eol, tab, tab
                ), eol
            );
        }

        output.push(")");

        return output;
    }
}