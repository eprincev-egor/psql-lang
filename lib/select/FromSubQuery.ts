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
        const startToken = cursor.nextToken;
        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
        }

        if ( !cursor.beforeValue("(") ) {
            cursor.setPositionBefore(startToken);
            return false;
        }

        const isSelect = cursor.before(Select);

        cursor.setPositionBefore(startToken);
        return isSelect;
    }

    static parse(cursor: Cursor): FromSubQueryRow {
        let lateral = false;
        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
            lateral = true;
        }

        let brackets = 0;
        while ( cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();
            brackets++;
        }

        const subQuery = cursor.parse(Select);

        for (let i = 0; i < brackets; i++) {
            cursor.skipSpaces();
            cursor.readValue(")");
            cursor.skipSpaces();
        }

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