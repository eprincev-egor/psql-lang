/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "./Operand";
import { BinaryOperator, BinaryOperatorType } from "./operator/BinaryOperator";
import { BooleanLiteral } from "./literal/BooleanLiteral";
import { ByteStringLiteral } from "./literal/ByteStringLiteral";
import { ColumnReference } from "./operand/ColumnReference";
import { IntervalLiteral } from "./literal/IntervalLiteral";
import { NullLiteral } from "./literal/NullLiteral";
import { NumberLiteral } from "./literal/NumberLiteral";
import { PostUnaryOperator } from "./operator/PostUnaryOperator";
import { PreUnaryOperator } from "./operator/PreUnaryOperator";
import { StringLiteral } from "./literal/StringLiteral";
import { Variable } from "./operand/Variable";
import { InOperator, InOperatorRow } from "./operator/InOperator";
import { ArrayLiteral } from "./literal/ArrayLiteral";
import { CaseWhen } from "./operand/CaseWhen";
import { FunctionReference } from "./operand/FunctionReference";
import { SubExpression } from "./operand/SubExpression";
import { FunctionCall } from "./operand/FunctionCall";
import { EqualAnyArray } from "./operator/EqualAnyArray";
import { EqualSomeArray } from "./operator/EqualSomeArray";
import { SubQuery } from "./operand/SubQuery";
import { Cast } from "./likeAreFunction/Cast";
import { PgType } from "./PgType";

import { likeAreFunction } from "./likeAreFunction";
import { Between } from "./operator/Between";
import { Collate } from "./operator/Collate";
import { SquareBrackets } from "./operator/SquareBrackets";

export {Operand};

export interface ExpressionRow {
    operand: Operand;
}

export interface ParseExpressionOptions {
    stopOnOperators?: string[];
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
            cursor.before(SubExpression)
        );
    }

    static parse(
        cursor: Cursor,
        options: ParseExpressionOptions = {}
    ): ExpressionRow {
        const operand: Operand = this.parseOperand(cursor, options);

        const binary = this.parseBinary(cursor, operand, options);
        if ( binary ) {
            return {operand: binary};
        }

        return {operand};
    }

    static parseOperand(
        cursor: Cursor,
        options: ParseExpressionOptions = {}
    ): Operand {
        let operand = cursor.before(PreUnaryOperator) ?
            cursor.parse(PreUnaryOperator) :
            this.parseSimpleOperand(cursor);

        operand = this.parseBrackets(cursor, operand);

        if ( cursor.beforeWord("collate") ) {
            const collateRow = Collate.parseCollate(cursor, operand);
            const collate = new Collate({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row: collateRow
            });

            operand = collate;
        }

        if ( cursor.beforeWord("between") ) {
            const betweenRow = Between.parseContent(cursor, operand);
            const between = new Between({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row: betweenRow
            });

            operand = between;
        }

        if (
            cursor.beforeWord("in") &&
            (
                !options.stopOnOperators ||
                !options.stopOnOperators.includes("in")
            ) ||
            cursor.beforePhrase("not", "in")
        ) {
            let not = false;
            if ( cursor.beforeWord("not") ) {
                cursor.readWord("not");
                not = true;
            }

            cursor.readPhrase("in", "(");
            cursor.skipSpaces();

            const inElements = cursor.parseChainOf(Expression, ",")
                .map((expr) => expr.operand());

            cursor.skipSpaces();
            cursor.readValue(")");

            const row: InOperatorRow = not ? {
                operand,
                notIn: inElements
            } : {
                operand,
                in: inElements
            };

            const inOperator = new InOperator({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row
            });
            return inOperator;
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

    private static parseBrackets(
        cursor: Cursor,
        operand: Operand
    ): Operand {

        if ( cursor.beforeValue("[") ) {
            const row = SquareBrackets.parseIndex(cursor, operand);
            const brackets = new SquareBrackets({
                position: {
                    start: operand.position!.start,
                    end: cursor.nextToken.position
                },
                row
            });

            operand = brackets;
            operand = this.parseBrackets(cursor, operand);
        }

        return operand;
    }

    private static parseSimpleOperand(cursor: Cursor): Operand {
        const operand = cursor.parseOneOf([
            SubQuery, SubExpression,
            IntervalLiteral,
            BooleanLiteral, NullLiteral,
            StringLiteral, ByteStringLiteral,
            NumberLiteral, Variable,
            ArrayLiteral, CaseWhen,
            ColumnReference
        ], "expected expression operand");

        cursor.skipSpaces();
        if ( operand instanceof ColumnReference && cursor.beforeValue("(") ) {
            const functionNameReference = FunctionReference.fromColumn(cursor, operand);
            const functionName = functionNameReference.toLowerCase();

            if ( functionName in likeAreFunction ) {
                const Syntax = likeAreFunction[ functionName ];

                cursor.readValue("(");
                cursor.skipSpaces();

                const row = Syntax.parseContent(cursor);

                cursor.skipSpaces();
                cursor.readValue(")");

                const syntax = new Syntax({
                    position: {
                        start: operand.position!.start,
                        end: cursor.nextToken.position
                    },
                    row
                });
                return syntax;
            }

            const functionCall = FunctionCall.parseAfterName(cursor, functionNameReference);
            return functionCall;
        }

        return operand;
    }

    private static parseBinary(
        cursor: Cursor,
        left: Operand,
        options: ParseExpressionOptions
    ): Operand | undefined {
        cursor.skipSpaces();

        if ( !BinaryOperator.entryOperator(cursor) ) {
            return;
        }

        const operatorToken = cursor.nextToken;
        const operator = BinaryOperator.parseOperator(cursor);

        if (
            options.stopOnOperators &&
            options.stopOnOperators.includes(operator)
        ) {
            cursor.setPositionBefore(operatorToken);
            return;
        }

        if ( operator === "::" ) {
            const type = cursor.parse(PgType);
            const cast = new Cast({
                position: {
                    start: left.position!.start,
                    end: cursor.nextToken.position
                },
                row: {
                    cast: left,
                    as: type
                }
            });
            return cast;
        }

        cursor.skipSpaces();
        const right = this.parseOperand(cursor);

        const binary = this.createBinaryOperator(
            cursor,
            left, operator, right
        );

        const nextBinary = this.parseBinary(cursor, binary, options);
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

    operand(): Operand {
        return this.row.operand;
    }
}
