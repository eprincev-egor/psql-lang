/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "./Operand";
import { cycle } from "./cycle";
import { BinaryOperator, BinaryOperatorType } from "./BinaryOperator";
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
import { FunctionReference } from "./FunctionReference";
import { FunctionCall } from "./FunctionCall";
import { EqualAnyArray } from "./EqualAnyArray";
import { EqualSomeArray } from "./EqualSomeArray";

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

        const operand = cursor.parseOneOf([
            SubExpression, IntervalLiteral,
            BooleanLiteral, NullLiteral,
            StringLiteral, ByteStringLiteral,
            NumberLiteral, Variable,
            ArrayLiteral, CaseWhen,
            ColumnReference
        ], "expected expression operand");

        cursor.skipSpaces();
        if ( operand instanceof ColumnReference && cursor.beforeValue("(") ) {
            const functionName = FunctionReference.fromColumn(cursor, operand);
            const functionCall = FunctionCall.parseAfterName(cursor, functionName);
            return functionCall;
        }

        return operand;
    }

    private static parseBinary(
        cursor: Cursor,
        left: Operand
    ): Operand | undefined {
        cursor.skipSpaces();

        if ( !BinaryOperator.entryOperator(cursor) ) {
            return;
        }

        const operator = BinaryOperator.parseOperator(cursor);

        cursor.skipSpaces();
        const right = this.parseOperand(cursor);

        const binary = this.createBinaryOperator(
            cursor,
            left, operator, right
        );

        const nextBinary = this.parseBinary(cursor, binary);
        if ( nextBinary ) {
            return nextBinary;
        }
        return binary;
    }

    private static createBinaryOperator(
        cursor: Cursor,
        left: Operand,
        operator: BinaryOperatorType,
        right: Operand
    ) {
        const equalAny = (
            right.is(FunctionCall) &&
            ["any", "all", "some"].includes(right.row.call.toString()) &&
            operator === "="
        );
        if ( equalAny && right.is(FunctionCall) ) {
            return this.createEqualAny(cursor, left, right);
        }

        if (
            left.is(BinaryOperator) &&
            left.lessPrecedence(operator)
        ) {
            return new BinaryOperator({
                position: {
                    start: left.row.left.position!.start,
                    end: right.position!.end
                },
                row: {
                    left: left.row.left,
                    operator: left.row.operator,
                    right: new BinaryOperator({
                        position: {
                            start: left.row.right.position!.start,
                            end: right.position!.end
                        },
                        row: {
                            left: left.row.right,
                            operator,
                            right
                        }
                    })
                }
            });
        }

        return new BinaryOperator({
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
    }

    private static createEqualAny(
        cursor: Cursor,
        left: Operand,
        right: FunctionCall
    ) {
        if ( right.row.arguments.length === 0 ) {
            cursor.throwError("expected array argument", right);
        }
        if ( right.row.arguments.length > 1 ) {
            cursor.throwError("expected only one argument", right);
        }
        const type = right.row.call.toString();
        const arrayExpression = right.row.arguments[0];

        const position = {
            start: left.position!.start,
            end: right.position!.end
        };

        if ( type === "any" ) {
            return new EqualAnyArray({
                position,
                row: {
                    operand: left,
                    anyArray: arrayExpression
                }
            });
        }
        else {
            return new EqualSomeArray({
                position,
                row: {
                    operand: left,
                    someArray: arrayExpression
                }
            });
        }
    }

    template(): TemplateElement[] {
        return [this.row.operand];
    }
}

cycle.Expression = Expression;
require("./SubExpression");