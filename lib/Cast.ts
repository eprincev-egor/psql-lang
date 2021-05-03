import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "./Expression";
import { PgType } from "./PgType";

export interface CastRow {
    cast: Operand;
    as: PgType;
}

export class Cast extends AbstractNode<CastRow> {

    static parseContent(cursor: Cursor): CastRow {
        const cast = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readWord("as");

        const as = cursor.parse(PgType);

        return {cast, as};
    }

    template(): TemplateElement[] {
        return [this.row.cast, "::", this.row.as];
    }
}