import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualAllRow {
    operand: Operand;
    equalAll: Operand | Select;
}

export class EqualAll extends AbstractEqualSet<EqualAllRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "all");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualAllRow {
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