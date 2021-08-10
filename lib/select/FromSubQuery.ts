import {
    Cursor,
    TemplateElement,
    eol, tab, _, keyword
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { Name } from "../base";
import { Select } from "./Select";

export interface FromSubQueryRow extends FromItemRow {
    lateral?: true;
    subQuery: Select;
    as: Name;
}

export class FromSubQuery extends AbstractFromItem<FromSubQueryRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("(", "with") ||
            cursor.beforePhrase("(", "select") ||
            cursor.beforePhrase("lateral", "(", "with") ||
            cursor.beforePhrase("lateral", "(", "select")
        );
    }

    static parse(cursor: Cursor): FromSubQueryRow {
        let lateral = false;
        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
            lateral = true;
        }

        cursor.readValue("(");
        cursor.skipSpaces();

        const subQuery = cursor.parse(Select);

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        const otherParams = super.parseOther(cursor);
        const alias = otherParams.as;
        if ( !alias || !otherParams.hasOwnProperty("as") ) {
            cursor.throwError("subquery in FROM must have an alias");
        }

        const row: FromSubQueryRow = {
            ...otherParams,
            subQuery,
            as: alias
        };
        if ( lateral ) {
            row.lateral = true;
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.lateral ) {
            output.push( keyword("lateral"), _ );
        }

        output.push(
            "(", eol,
            tab, this.row.subQuery, eol,
            ")", _
        );

        super.printOther(output);

        return output;
    }
}