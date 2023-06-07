import {
    AbstractNode, Cursor,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Expression, Operand } from "../Expression";

export interface ArrayLiteralRow {
    array: Operand[];
}

export class ArrayLiteral extends AbstractNode<ArrayLiteralRow> {

    static entry(cursor: Cursor): boolean {
        if ( !cursor.beforeWord("array") ) {
            return false;
        }
        const startToken = cursor.nextToken;

        cursor.readWord("array");
        const isArrayLiteral = cursor.beforeValue("[");

        cursor.setPositionBefore(startToken);
        return isArrayLiteral;
    }

    static parse(cursor: Cursor): ArrayLiteralRow {
        cursor.readWord("array");
        cursor.readValue("[");
        cursor.skipSpaces();

        const array = cursor.parseChainOf(Expression, ",")
            .map((expr) => expr.operand());

        cursor.skipSpaces();
        cursor.readValue("]");

        return {array};
    }

    template(): TemplateElement[] {
        return [
            "array[",
            ...printChain(this.row.array, ",", _),
            "]"
        ];
    }
}