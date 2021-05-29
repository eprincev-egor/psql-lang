import { AbstractNode, Cursor } from "abstract-lang";
import { Expression, Operand } from "../../../Expression";

export abstract class AbstractEqualSet<TRow>
    extends AbstractNode<TRow> {

    static parseContent(cursor: Cursor): Operand {
        cursor.readValue("(");
        const content = cursor.parse(Expression).operand();
        cursor.readValue(")");

        return content;
    }
}