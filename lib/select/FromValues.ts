import {
    Cursor,
    TemplateElement,
    eol, tab, _, keyword, printChain
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { Name } from "../base";
import { ValueRow } from "./ValueRow";

export interface FromValuesRow extends FromItemRow {
    lateral?: true;
    values: ValueRow[];
    as: Name;
}

export class FromValues extends AbstractFromItem<FromValuesRow> {

    static entry(cursor: Cursor): boolean {
        const startToken = cursor.nextToken;
        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
        }

        if ( !cursor.beforeValue("(") ) {
            cursor.setPositionBefore(startToken);
            return false;
        }

        while ( cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();
        }

        const isValues = cursor.beforeWord("values");

        cursor.setPositionBefore(startToken);
        return isValues;
    }

    static parse(cursor: Cursor): FromValuesRow {
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

        cursor.readWord("values");
        const values = cursor.parseChainOf(ValueRow, ",");

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

        const row: FromValuesRow = {
            ...otherParams,
            values,
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
            tab, keyword("values"), eol,
            tab, tab, ...printChain(this.row.values, ",", eol, tab, tab), eol,
            ")", _
        );

        super.printOther(output);

        return output;
    }
}