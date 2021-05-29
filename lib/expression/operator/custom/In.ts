import {
    AbstractNode,
    TemplateElement, _, printChain, keyword, Cursor
} from "abstract-lang";
import { Select } from "../../../select";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface InRow {
    operand: Operand;
    in: Operand[] | Select;
}

export class In extends AbstractNode<InRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeWord("in");
    }

    static parseOperator(cursor: Cursor, operand: Operand): InRow {
        cursor.readPhrase("in", "(");
        cursor.skipSpaces();

        const inElements = cursor.before(Select) ?
            cursor.parse(Select) :
            cursor.parseChainOf(Expression, ",")
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
            ...this.templateContent(),
            ")"
        ];
    }

    private templateContent() {
        if ( Array.isArray(this.row.in) ) {
            return printChain(this.row.in, ",", _);
        }
        else {
            return [this.row.in];
        }
    }
}

customOperators.push(In);