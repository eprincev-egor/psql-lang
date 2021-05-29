import {
    AbstractNode,
    TemplateElement, _, printChain, keyword, Cursor
} from "abstract-lang";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface NotInRow {
    operand: Operand;
    notIn: Operand[];
}

export class NotIn extends AbstractNode<NotInRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("not", "in");
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotInRow {
        cursor.readPhrase("not", "in", "(");
        cursor.skipSpaces();

        const inElements = cursor.parseChainOf(Expression, ",")
            .map((expr) => expr.operand());

        cursor.skipSpaces();
        cursor.readValue(")");

        return {
            operand,
            notIn: inElements
        };
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            keyword("not"), keyword("in"), _, "(",
            ...printChain(this.row.notIn, ",", _),
            ")"
        ];
    }
}

customOperators.push(NotIn);