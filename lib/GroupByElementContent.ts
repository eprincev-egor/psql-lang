import {
    AbstractNode, Cursor,
    TemplateElement, printChain, _
} from "abstract-lang";
import { Expression, Operand } from "./Expression";

export type GroupByElementContentRow = {
    expression: Operand;
} | {
    expressions: Operand[];
}

// { expression | ( expression [, ...] ) }
export class GroupByElementContent extends AbstractNode<GroupByElementContentRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): GroupByElementContentRow {
        if ( cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();

            const expressions = cursor.parseChainOf(Expression, ",")
                .map((expr) => expr.operand());

            cursor.skipSpaces();
            cursor.readValue(")");

            return {expressions};
        }
        else {
            const expression = cursor.parse(Expression).operand();
            return {expression};
        }
    }

    template(): TemplateElement[] {
        if ( "expression" in this.row ) {
            return [this.row.expression];
        }
        else {
            return [
                "(",
                ...printChain(this.row.expressions, ",", _),
                ")"
            ];
        }
    }
}