/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand, cycle } from "./Operand";
import { BinaryOperator } from "./BinaryOperator";
import { BooleanLiteral } from "./BooleanLiteral";
import { ByteStringLiteral } from "./ByteStringLiteral";
import { ColumnReference } from "./ColumnReference";
import { IntervalLiteral } from "./IntervalLiteral";
import { NullLiteral } from "./NullLiteral";
import { NumberLiteral } from "./NumberLiteral";
import { PostUnaryOperator } from "./PostUnaryOperator";
import { PreUnaryOperator } from "./PreUnaryOperator";
import { StringLiteral } from "./StringLiteral";
import { Variable } from "./Variable";
import { InOperator } from "./InOperator";
import { NotInOperator } from "./NotInOperator";
import { ArrayLiteral } from "./ArrayLiteral";
import { CaseWhen } from "./CaseWhen";

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
            cursor.before(Variable) ||
            cursor.before(PreUnaryOperator) ||
            cursor.before(cycle.SubExpression!)
        );
    }

    static parse(cursor: Cursor): ExpressionRow {
        const operand: Operand = this.parseOperand(cursor);

        const binary = this.parseBinary(cursor, operand);
        if ( binary ) {
            return {operand: binary};
        }

        return {operand};
    }

    static parseOperand(cursor: Cursor): Operand {
        let operand = cursor.before(PreUnaryOperator) ?
            cursor.parse(PreUnaryOperator) :
            this.parseSimpleOperand(cursor);

        if ( cursor.beforeWord("in") ) {
            cursor.readWord("in");
            cursor.readValue("(");
            cursor.skipSpaces();

            const inElements = cursor.parseChainOf(Expression, ",");

            cursor.skipSpaces();
            cursor.readValue(")");

            const inOperator = new InOperator({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row: {
                    operand,
                    in: inElements
                }
            });
            return inOperator;
        }
        else if ( cursor.beforePhrase("not", "in") ) {
            cursor.readPhrase("not", "in");
            cursor.readValue("(");
            cursor.skipSpaces();

            const notInElements = cursor.parseChainOf(Expression, ",");

            cursor.skipSpaces();
            cursor.readValue(")");

            const notInOperator = new NotInOperator({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row: {
                    operand,
                    notIn: notInElements
                }
            });
            return notInOperator;
        }


        if ( PostUnaryOperator.entryOperator(cursor) ) {
            const postOperator = PostUnaryOperator.parseOperator(cursor);
            operand = new PostUnaryOperator({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row: {
                    operand,
                    postOperator
                }
            });
        }

        return operand;
    }

    private static parseSimpleOperand(cursor: Cursor): Operand {
        const SubExpression = cycle.SubExpression!;

        if ( cursor.before(SubExpression) ) {
            return cursor.parse(SubExpression);
        }
        else if ( cursor.before(BooleanLiteral) ) {
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
        else if ( cursor.before(ArrayLiteral) ) {
            return cursor.parse(ArrayLiteral);
        }
        else if ( cursor.before(CaseWhen) ) {
            return cursor.parse(CaseWhen);
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

        if ( !BinaryOperator.entryOperator(cursor) ) {
            return;
        }

        const operator = BinaryOperator.parseOperator(cursor);

        cursor.skipSpaces();
        const right = this.parseOperand(cursor);

        const binary = new BinaryOperator({
            position: {
                start: left.position!.start,
                end: right.position!.end
            },
            row: {
                left,
                operator,
                right
            }
        });

        const nextBinary = this.parseBinary(cursor, binary);
        if ( nextBinary ) {
            return nextBinary;
        }
        return binary;
    }

    template(): TemplateElement[] {
        return [this.row.operand];
    }
}

cycle.Expression = Expression;
require("./SubExpression");