import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualAnyArrayRow {
    operand: Operand;
    equalAny: Operand;
}

export class EqualAny extends AbstractEqualSet<EqualAnyArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "any");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAnyArrayRow {
        cursor.readPhrase("=", "any");
        const equalAny = super.parseContent(cursor);
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

customOperators.push(EqualAny);