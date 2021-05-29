import {
    AbstractNode,
    TemplateElement, _, printChain, keyword, Cursor
} from "abstract-lang";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface InRow {
    operand: Operand;
    in: Operand[];
}

export class In extends AbstractNode<InRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeWord("in");
    }

    static parseOperator(cursor: Cursor, operand: Operand): InRow {
        cursor.readPhrase("in", "(");
        cursor.skipSpaces();

        const inElements = cursor.parseChainOf(Expression, ",")
            .map((expr) => expr.operand());

        cursor.skipSpaces();
        cursor.readValue(")");

        return {
            operand,
            in: inElements
        };
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            keyword("in"), _, "(",
            ...printChain(this.row.in, ",", _),
            ")"
        ];
    }
}

customOperators.push(In);