import { AbstractNode, Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand, Expression } from "../../../Expression";
import { customOperators } from "../customOperators";

export interface EqualSomeArrayRow {
    operand: Operand;
    equalSome: Operand;
}

export class EqualSome extends AbstractNode<EqualSomeArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "some");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualSomeArrayRow {
        cursor.readPhrase("=", "some", "(");
        const equalSome = cursor.parse(Expression).operand();
        cursor.readValue(")");

        return {operand, equalSome};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "=", _,
            "some(", this.row.equalSome, ")"
        ];
    }
}

customOperators.push(EqualSome);