import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "../../Expression";

export interface SquareBracketsRow {
    operand: Operand;
    index: Operand;
}

export class SquareBrackets extends AbstractNode<SquareBracketsRow> {

    static parseIndex(cursor: Cursor, operand: Operand): SquareBracketsRow {
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