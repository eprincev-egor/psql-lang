import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface NotEqualAnyRow {
    operand: Operand;
    notEqualAny: Operand | Select;
}

export class NotEqualAny extends AbstractEqualSet<NotEqualAnyRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("!", "=", "any") ||
            cursor.beforePhrase("<", ">", "any")
        );
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotEqualAnyRow {
        if ( cursor.beforeValue("<") ) {
            cursor.readPhrase("<", ">", "any");
        }
        else {
            cursor.readPhrase("!", "=", "any");
        }

        const notEqualAny = super.parseContent(cursor);
        return {operand, notEqualAny};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "!=", _,
            "any(", this.row.notEqualAny, ")"
        ];
    }
}

customOperators.push(NotEqualAny);