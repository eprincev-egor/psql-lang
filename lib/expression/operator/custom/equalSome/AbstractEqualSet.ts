import { AbstractNode, AnyRow, Cursor } from "abstract-lang";
import { Select } from "../../../../select";
import { Expression, Operand } from "../../../Expression";

export abstract class AbstractEqualSet<TRow extends AnyRow>
    extends AbstractNode<TRow> {

    static parseContent(cursor: Cursor): Operand | Select {
        cursor.readValue("(");
        cursor.skipSpaces();

        const content = (
            cursor.before(Select) ?
                cursor.parse(Select) :
                cursor.parse(Expression).operand()
        );

        cursor.skipSpaces();
        cursor.readValue(")");

        return content;
    }
}