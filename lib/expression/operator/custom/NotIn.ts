import {
    AbstractNode,
    TemplateElement, _, printChain, keyword, Cursor
} from "abstract-lang";
import { Select } from "../../../select";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface NotInRow {
    operand: Operand;
    notIn: Operand[] | Select;
}

export class NotIn extends AbstractNode<NotInRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("not", "in");
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotInRow {
        cursor.readPhrase("not", "in", "(");
        cursor.skipSpaces();

        const inElements = cursor.before(Select) ?
            cursor.parse(Select) :
            cursor.parseChainOf(Expression, ",")
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
            ...this.templateContent(),
            ")"
        ];
    }

    private templateContent() {
        if ( Array.isArray(this.row.notIn) ) {
            return printChain(this.row.notIn, ",", _);
        }
        else {
            return [this.row.notIn];
        }
    }
}

customOperators.push(NotIn);