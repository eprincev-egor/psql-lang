import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "./Expression";
import { PgType } from "./PgType";
import { likeAreFunction } from "./likeAreFunction/likeAreFunction";
import { customOperators } from "./operator/custom/customOperators";

export interface CastRow {
    cast: Operand;
    as: PgType;
}

export class Cast extends AbstractNode<CastRow> {

    // ::type
    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeSequence(":", ":");
    }

    // ::type
    static parseOperator(cursor: Cursor, left: Operand): CastRow {
        cursor.readValue(":");
        cursor.readValue(":");
        cursor.skipSpaces();

        return {
            cast: left,
            as: cursor.parse(PgType)
        };
    }

    // cast(... as type)
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

likeAreFunction.cast = Cast;
customOperators.push(Cast);