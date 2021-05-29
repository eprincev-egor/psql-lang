import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualSomeRow {
    operand: Operand;
    equalSome: Operand | Select;
}

export class EqualSome extends AbstractEqualSet<EqualSomeRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "some");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualSomeRow {
        cursor.readPhrase("=", "some");
        const equalSome = super.parseContent(cursor);
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