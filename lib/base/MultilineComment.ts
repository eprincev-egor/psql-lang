import { AbstractNode, Cursor } from "abstract-lang";

export interface MultilineCommentRow {
    multilineComment: string;
}

export class MultilineComment extends AbstractNode<MultilineCommentRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeSequence("/", "*");
    }

    static parse(cursor: Cursor): MultilineCommentRow {
        cursor.readValue("/");
        cursor.readValue("*");

        let multilineComment = "";
        while (
            !cursor.beforeSequence("*", "/") &&
            !cursor.beforeEnd()
        ) {
            if ( cursor.before(MultilineComment) ) {
                const subComment = cursor.parse(MultilineComment);
                multilineComment += subComment.toString();
                continue;
            }

            multilineComment += cursor.readAnyOne().value;
        }

        cursor.readValue("*");
        cursor.readValue("/");

        return {multilineComment};
    }

    template(): string {
        return `/*${this.row.multilineComment}*/`;
    }
}