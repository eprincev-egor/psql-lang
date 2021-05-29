import { AbstractNode, Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand, Expression } from "../../Expression";
import { customOperators } from "./customOperators";

export interface EqualAnyArrayRow {
    operand: Operand;
    equalAny: Operand;
}

export class EqualAnyArray extends AbstractNode<EqualAnyArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "any");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAnyArrayRow {
        cursor.readPhrase("=", "any", "(");
        const equalAny = cursor.parse(Expression).operand();
        cursor.readValue(")");

        return {operand, equalAny};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "=", _,
            "any(", this.row.equalAny, ")"
        ];
    }
}

customOperators.push(EqualAnyArray);