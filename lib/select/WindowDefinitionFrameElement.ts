import {
    AbstractNode, Cursor,
    TemplateElement, keyword
} from "abstract-lang";
import { NumberLiteral } from "../expression/literal/NumberLiteral";

export type WindowDefinitionFrameElementRow = {
    type: "preceding" | "following";
    value: WindowDefinitionFrameElementValueType;
} | {
    type: "currentRow";
}
export type WindowDefinitionFrameElementValueType = "unbounded" | NumberLiteral;

/*
UNBOUNDED PRECEDING
UNBOUNDED FOLLOWING
CURRENT ROW
value PRECEDING
value FOLLOWING
    */
export class WindowDefinitionFrameElement extends AbstractNode<WindowDefinitionFrameElementRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("unbounded") ||
            cursor.beforeWord("current") ||
            cursor.before(NumberLiteral)
        );
    }

    static parse(cursor: Cursor): WindowDefinitionFrameElementRow {
        if ( cursor.beforeWord("unbounded") ) {
            cursor.readWord("unbounded");
            const row = this.parseType(cursor, "unbounded");
            return row;
        }
        else if ( cursor.beforeWord("current") ) {
            cursor.readPhrase("current", "row");
            return {type: "currentRow"};
        }
        else {
            const value = cursor.parse(NumberLiteral);
            cursor.skipSpaces();

            const row = this.parseType(cursor, value);
            return row;
        }
    }

    private static parseType(
        cursor: Cursor,
        value: WindowDefinitionFrameElementValueType
    ): WindowDefinitionFrameElementRow {
        if ( cursor.beforeWord("preceding") ) {
            cursor.readWord("preceding");

            return {value, type: "preceding"};
        }
        else if ( cursor.beforeWord("following") ) {
            cursor.readWord("following");

            return {value, type: "following"};
        }
        else {
            cursor.throwError("expected preceding or following");
        }
    }

    template(): TemplateElement[] {
        if ( this.row.type === "currentRow" ) {
            return [
                keyword("current"), keyword("row")
            ];
        }

        if ( this.row.value instanceof NumberLiteral ) {
            return [
                this.row.value, keyword(this.row.type)
            ];
        }

        return [
            keyword(this.row.value), keyword(this.row.type)
        ];
    }
}