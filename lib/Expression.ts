import { AbstractNode, Cursor, OperatorsToken, TemplateElement } from "abstract-lang";
import { BinaryOperator, BinaryOperatorType } from "./BinaryOperator";
import { BooleanLiteral } from "./BooleanLiteral";
import { ByteStringLiteral } from "./ByteStringLiteral";
import { ColumnReference } from "./ColumnReference";
import { IntervalLiteral } from "./IntervalLiteral";
import { NullLiteral } from "./NullLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { Operand } from "./Operand";
import { StringLiteral } from "./StringLiteral";
import { Variable } from "./Variable";

export interface ExpressionRow {
    operand: Operand;
}

export class Expression extends AbstractNode<ExpressionRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.before(ColumnReference) ||
            cursor.before(NumberLiteral) ||
            cursor.before(StringLiteral) ||
            cursor.before(ByteStringLiteral) ||
            cursor.before(Variable)
        );
    }

    static parse(cursor: Cursor): ExpressionRow {
        const operand: Operand = this.parseSimpleOperand(cursor);

        const binary = Expression.parseBinary(cursor, operand);
        if ( binary ) {
            return {operand: binary};
        }

        return {operand};
    }

    private static parseSimpleOperand(cursor: Cursor): Operand {
        if ( cursor.before(BooleanLiteral) ) {
            return cursor.parse(BooleanLiteral);
        }
        else if ( cursor.before(NullLiteral) ) {
            return cursor.parse(NullLiteral);
        }
        else if ( cursor.before(IntervalLiteral) ) {
            return cursor.parse(IntervalLiteral);
        }
        else if ( cursor.before(StringLiteral) ) {
            return cursor.parse(StringLiteral);
        }
        else if ( cursor.before(ByteStringLiteral) ) {
            return cursor.parse(ByteStringLiteral);
        }
        else if ( cursor.before(NumberLiteral) ) {
            return cursor.parse(NumberLiteral);
        }
        else if ( cursor.before(Variable) ) {
            return cursor.parse(Variable);
        }
        else if ( cursor.before(ColumnReference) ) {
            return cursor.parse(ColumnReference);
        }

        cursor.throwError("expected expression operand");
    }

    private static parseBinary(
        cursor: Cursor,
        left: Operand
    ): BinaryOperator | undefined {
        cursor.skipSpaces();

        if ( !cursor.beforeToken(OperatorsToken) ) {
            return;
        }

        const operator = cursor.readAll(OperatorsToken).join("") as BinaryOperatorType;
        cursor.skipSpaces();
        const right = this.parseSimpleOperand(cursor);

        const binary = new BinaryOperator({
            row: {
                left,
                operator,
                right
            }
        });
        return binary;
    }

    template(): TemplateElement {
        return this.row.operand;
    }
}