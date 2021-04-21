import { AbstractNode, Cursor, OperatorsToken, TemplateElement } from "abstract-lang";
import { Expression } from "./Expression";
import { NumberLiteral } from "./NumberLiteral";
import { Operand } from "./Operand";

export interface PreUnaryOperatorRow {
    operand: Operand;
    preOperator: string;
}

export class PreUnaryOperator extends AbstractNode<PreUnaryOperatorRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(OperatorsToken) &&
            !cursor.before(NumberLiteral) &&
            !cursor.beforeValue("*") ||
            cursor.beforeWord("not")
        );
    }

    static parse(cursor: Cursor): PreUnaryOperatorRow {
        const preOperator = cursor.beforeToken(OperatorsToken) ?
            cursor.read(OperatorsToken).value :
            cursor.readWord("not").toLowerCase();

        cursor.skipSpaces();

        const operand = Expression.parseOperand(cursor);
        return {preOperator, operand};
    }

    template(): TemplateElement[] {
        return [this.row.preOperator, " ", this.row.operand];
    }
}