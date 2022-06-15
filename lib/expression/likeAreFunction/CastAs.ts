import { AbstractNode, Cursor, keyword, TemplateElement, _ } from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { PgType } from "../PgType";
import { likeAreFunction } from "./likeAreFunction";

export interface CastAsRow {
    cast: Operand;
    as: PgType;
}

export class CastAs extends AbstractNode<CastAsRow> {

    // cast(... as type)
    static parseContent(cursor: Cursor): CastAsRow {
        const cast = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readWord("as");

        const as = cursor.parse(PgType);

        return {cast, as};
    }

    template(): TemplateElement[] {
        return ["cast(", _, this.row.cast, keyword("as"), this.row.as, _, ")"];
    }
}

likeAreFunction.cast = CastAs;