import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "../../Expression";
import { PgType } from "../../PgType";
import { customOperators } from "./customOperators";

export interface CastToRow {
    cast: Operand;
    to: PgType;
}

export class CastTo extends AbstractNode<CastToRow> {

    // ::type
    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeSequence(":", ":");
    }

    // ::type
    static parseOperator(cursor: Cursor, left: Operand): CastToRow {
        cursor.readValue(":");
        cursor.readValue(":");
        cursor.skipSpaces();

        return {
            cast: left,
            to: cursor.parse(PgType)
        };
    }

    template(): TemplateElement[] {
        return [this.row.cast,"::", this.row.to];
    }
}

customOperators.push(CastTo);