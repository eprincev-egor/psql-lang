import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualAllArrayRow {
    operand: Operand;
    equalAll: Operand;
}

export class EqualAll extends AbstractEqualSet<EqualAllArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "all");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAllArrayRow {
        cursor.readPhrase("=", "all");
        const equalAll = super.parseContent(cursor);
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