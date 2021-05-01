import {
    AbstractNode, Cursor,
    TemplateElement, printChain, _
} from "abstract-lang";
import { ValueItem } from "./ValueItem";

export interface ValueRowRow {
    values: ValueItem[];
}

export class ValueRow extends AbstractNode<ValueRowRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("(");
    }

    static parse(cursor: Cursor): ValueRowRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const values = cursor.parseChainOf(ValueItem, ",");

        cursor.skipSpaces();
        cursor.readValue(")");

        return {values};
    }

    template(): TemplateElement[] {
        return [
            "(",
            ...printChain(this.row.values, ",", _),
            ")"
        ];
    }
}