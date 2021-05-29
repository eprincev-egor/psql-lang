import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualAnyRow {
    operand: Operand;
    equalAny: Operand | Select;
}

export class EqualAny extends AbstractEqualSet<EqualAnyRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "any");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAnyRow {
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