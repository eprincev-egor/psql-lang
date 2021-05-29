import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface SquareBracketsRow {
    operand: Operand;
    index: Operand;
}

export class SquareBrackets extends AbstractNode<SquareBracketsRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeValue("[");
    }

    static parseOperator(cursor: Cursor, operand: Operand): SquareBracketsRow {
        cursor.readValue("[");
        cursor.skipSpaces();

        const index = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readValue("]");
        return {operand, index};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand, "[", this.row.index, "]"
        ];
    }
}

customOperators.push(SquareBrackets);