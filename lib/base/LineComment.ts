import { AbstractNode, Cursor, EndOfLineToken } from "abstract-lang";

export interface LineCommentRow {
    inlineComment: string;
}

export class LineComment extends AbstractNode<LineCommentRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeSequence("-", "-");
    }

    static parse(cursor: Cursor): LineCommentRow {
        cursor.readValue("-");
        cursor.readValue("-");

        let inlineComment = "";
        while (
            !cursor.beforeToken(EndOfLineToken) &&
            !cursor.beforeEnd()
        ) {
            inlineComment += cursor.readAnyOne().value;
        }
        return {inlineComment};
    }

    template(): string {
        return "--" + this.row.inlineComment;
    }
}