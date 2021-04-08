import {
    AbstractNode, Cursor,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Expression } from "./Expression";

export interface ArrayLiteralRow {
    array: Expression[];
}

export class ArrayLiteral extends AbstractNode<ArrayLiteralRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("array");
    }

    static parse(cursor: Cursor): ArrayLiteralRow {
        cursor.readWord("array");
        cursor.readValue("[");
        cursor.skipSpaces();

        const array = cursor.parseChainOf(Expression, ",");

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