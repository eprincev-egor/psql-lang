import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { likeAreFunction } from "./likeAreFunction";

export interface PositionRow {
    position: Operand;
    in: Operand;
}

export class Position extends AbstractNode<PositionRow> {

    static parseContent(cursor: Cursor): PositionRow {
        const position = Expression.parse(cursor, {
            stopOnOperators: ["in"]
        }).operand;

        cursor.skipSpaces();
        cursor.readWord("in");

        const in_ = cursor.parse(Expression).operand();

        return {position, in: in_};
    }

    template(): TemplateElement[] {
        return [
            keyword("position"), "(",
            this.row.position,
            keyword("in"), _,
            this.row.in,
            ")"
        ];
    }
}

likeAreFunction.position = Position;