import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { IntervalType, tryParseInterval } from "./intervals";

export interface ExtractRow {
    extract: IntervalType;
    from: Operand;
}

export class Extract extends AbstractNode<ExtractRow> {

    static parseContent(cursor: Cursor): ExtractRow {
        const extract = tryParseInterval(cursor);
        if ( !extract ) {
            cursor.throwError(
                `unrecognized extract field: ${cursor.nextToken.value}`
            );
        }

        cursor.readWord("from");
        const from = cursor.parse(Expression).operand();

        return {extract, from};
    }

    template(): TemplateElement[] {
        return [
            keyword("extract"), "(", _,
            keyword(this.row.extract),
            keyword("from"),
            _, this.row.from, _,
            ")"
        ];
    }
}