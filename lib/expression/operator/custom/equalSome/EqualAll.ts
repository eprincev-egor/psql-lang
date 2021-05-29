import { AbstractNode, Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand, Expression } from "../../../Expression";
import { customOperators } from "../customOperators";

export interface EqualAllArrayRow {
    operand: Operand;
    equalAll: Operand;
}

export class EqualAll extends AbstractNode<EqualAllArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "all");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAllArrayRow {
        cursor.readPhrase("=", "all", "(");
        const equalAll = cursor.parse(Expression).operand();
        cursor.readValue(")");

        return {operand, equalAll};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "=", _,
            "all(", this.row.equalAll, ")"
        ];
    }
}

customOperators.push(EqualAll);