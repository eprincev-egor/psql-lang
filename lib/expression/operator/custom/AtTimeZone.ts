import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { StringLiteral } from "../../literal";
import { Operand } from "./../../Expression";
import { customOperators } from "./customOperators";

export interface AtTimeZoneRow {
    operand: Operand;
    atTimeZone: StringLiteral;
}

export class AtTimeZone extends AbstractNode<AtTimeZoneRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeWord("at");
    }

    static parseOperator(cursor: Cursor, operand: Operand): AtTimeZoneRow {
        cursor.readPhrase("at", "time", "zone");

        const atTimeZone = cursor.parse(StringLiteral);
        return {operand, atTimeZone};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand, _,
            keyword("at"),
            keyword("time"),
            keyword("zone"),
            this.row.atTimeZone
        ];
    }
}

customOperators.push(AtTimeZone);