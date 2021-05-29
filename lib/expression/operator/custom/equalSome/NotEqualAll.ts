import { Cursor, TemplateElement, _ } from "abstract-lang";
import { Select } from "../../../../select";
import { Operand } from "../../../Expression";
import { customOperators } from "../customOperators";
import { AbstractEqualSet } from "./AbstractEqualSet";

export interface NotEqualAllRow {
    operand: Operand;
    notEqualAll: Operand | Select;
}

export class NotEqualAll extends AbstractEqualSet<NotEqualAllRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("!", "=", "all") ||
            cursor.beforePhrase("<", ">", "all")
        );
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotEqualAllRow {
        if ( cursor.beforeValue("<") ) {
            cursor.readPhrase("<", ">", "all");
        }
        else {
            cursor.readPhrase("!", "=", "all");
        }

        const notEqualAll = super.parseContent(cursor);
        return {operand, notEqualAll};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "!=", _,
            "all(", this.row.notEqualAll, ")"
        ];
    }
}

customOperators.push(NotEqualAll);