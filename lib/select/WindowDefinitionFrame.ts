import {
    AbstractNode, Cursor,
    TemplateElement, keyword
} from "abstract-lang";
import { WindowDefinitionFrameElement } from "./WindowDefinitionFrameElement";

export interface WindowDefinitionFrameRow {
    type: WindowDefinitionFrameType;
    start: WindowDefinitionFrameElement;
    end?: WindowDefinitionFrameElement;
}
export type WindowDefinitionFrameType = "range" | "rows";

/*
The frame_clause can be one of
{ RANGE | ROWS } frame_start
{ RANGE | ROWS } BETWEEN frame_start AND frame_end
*/
export class WindowDefinitionFrame extends AbstractNode<WindowDefinitionFrameRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("range") ||
            cursor.beforeWord("rows")
        );
    }

    static parse(cursor: Cursor): WindowDefinitionFrameRow {
        const type = this.parseType(cursor);

        if ( cursor.beforeWord("between") ) {
            cursor.readWord("between");

            const start = cursor.parse(WindowDefinitionFrameElement);

            cursor.skipSpaces();
            cursor.readWord("and");

            const end = cursor.parse(WindowDefinitionFrameElement);

            return {type, start, end};
        }
        else {
            const start = cursor.parse(WindowDefinitionFrameElement);
            return {type, start};
        }
    }

    private static parseType(cursor: Cursor): WindowDefinitionFrameType {
        if ( cursor.beforeWord("range") ) {
            cursor.readWord("range");
            return "range";
        }
        else {
            cursor.readWord("rows");
            return "rows";
        }
    }

    template(): TemplateElement[] {
        if ( this.row.end ) {
            return [
                keyword(this.row.type),
                keyword("between"), this.row.start,
                keyword("and"), this.row.end
            ];
        }
        else {
            return [
                keyword(this.row.type), this.row.start
            ];
        }
    }
}