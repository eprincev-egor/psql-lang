import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface NotEqualSomeRow {
    operand: Operand;
    notEqualSome: Operand | Select;
}

export class NotEqualSome extends AbstractEqualSet<NotEqualSomeRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("!", "=", "some") ||
            cursor.beforePhrase("<", ">", "some")
        );
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotEqualSomeRow {
        if ( cursor.beforeValue("<") ) {
            cursor.readPhrase("<", ">", "some");
        }
        else {
            cursor.readPhrase("!", "=", "some");
        }

        const notEqualSome = super.parseContent(cursor);
        return {operand, notEqualSome};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "!=", _,
            "some(", this.row.notEqualSome, ")"
        ];
    }
}

customOperators.push(NotEqualSome);