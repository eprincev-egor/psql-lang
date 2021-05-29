import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface EqualSomeArrayRow {
    operand: Operand;
    equalSome: Operand;
}

export class EqualSome extends AbstractEqualSet<EqualSomeArrayRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("=", "some");
    }

    static parseOperator(cursor: Cursor, operand: Operand): EqualSomeArrayRow {
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