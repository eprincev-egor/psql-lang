import {
    Cursor,
    TemplateElement, _, keyword
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { FunctionCall } from "../expression/operand/FunctionCall";
import { FunctionReference } from "../expression/operand/FunctionReference";

export interface FromFunctionRow extends FromItemRow {
    lateral?: true;
    withOrdinality?: true;
    function: FunctionCall;
}

export class FromFunction extends AbstractFromItem<FromFunctionRow> {

    static entry(cursor: Cursor): boolean {
        const startToken = cursor.nextToken;
        let isFromFunction = false;

        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
        }

        if ( cursor.before(FunctionReference) ) {
            cursor.parse(FunctionReference);

            if ( cursor.beforeValue("(") ) {
                isFromFunction = true;
            }
        }

        cursor.setPositionBefore(startToken);
        return isFromFunction;
    }

    static parse(cursor: Cursor): FromFunctionRow {
        let lateral = false;
        if ( cursor.beforeWord("lateral") ) {
            cursor.readWord("lateral");
            lateral = true;
        }

        const function_ = cursor.parse(FunctionCall);

        let withOrdinality = false;
        if ( cursor.beforeWord("with") ) {
            cursor.readPhrase("with", "ordinality");
            withOrdinality = true;
        }

        const otherParams = super.parseOther(cursor);
        const row: FromFunctionRow = {
            ...otherParams,
            function: function_
        };
        if ( lateral ) {
            row.lateral = true;
        }
        if ( withOrdinality ) {
            row.withOrdinality = true;
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.lateral ) {
            output.push( keyword("lateral"), _ );
        }

        output.push( this.row.function );

        if ( this.row.withOrdinality ) {
            output.push( _, keyword("with"), keyword("ordinality") );
        }
        else if ( this.row.as ) {
            output.push(_);
        }

        super.printOther(output);

        return output;
    }
}