/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "./Operand";
import { BinaryOperator } from "./operator/BinaryOperator";
import { BooleanLiteral } from "./literal/BooleanLiteral";
import { ByteStringLiteral } from "./literal/ByteStringLiteral";
import { ColumnReference } from "./ColumnReference";
import { IntervalLiteral } from "./literal/IntervalLiteral";
import { NullLiteral } from "./literal/NullLiteral";
import { NumberLiteral } from "./literal/NumberLiteral";
import { PostUnaryOperator } from "./operator/PostUnaryOperator";
import { PreUnaryOperator } from "./operator/PreUnaryOperator";
import { StringLiteral } from "./literal/StringLiteral";
import { Variable } from "./Variable";
import { ArrayLiteral } from "./literal/ArrayLiteral";
import { CaseWhen } from "./CaseWhen";
import { FunctionReference } from "./FunctionReference";
import { SubExpression } from "./SubExpression";
import { FunctionCall } from "./FunctionCall";
import { SubQuery } from "./SubQuery";
import { likeAreFunction } from "./likeAreFunction";
import { CurrentDate } from "./literal/CurrentDate";
import { TimestampLiteral } from "./literal/TimestampLiteral";
import { customOperators } from "./operator/custom";

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

        if ( PostUnaryOperator.entryOperator(cursor) ) {
            const postOperator = PostUnaryOperator.parseOperator(cursor) as string;
            operand = cursor.create(PostUnaryOperator, operand, {
                operand,
                postOperator
            });
        }

        operand = this.parseCustomOperator(cursor, operand, options);

        return operand;
    }

    private static parseCustomOperator(
        cursor: Cursor,
        operand: Operand,
        options: ParseExpressionOptions
    ): Operand {
        cursor.skipSpaces();

        let hasCustomOperator = false;

        for (const CustomOperator of customOperators) {
            if ( !CustomOperator.entryOperator(cursor) ) {
                continue;
            }

            const needIgnore = (
                options.stopOnOperators &&
                options.stopOnOperators.includes("in") &&
                cursor.beforeWord("in")
            );
            if ( needIgnore ) {
                continue;
            }

            const row = CustomOperator.parseOperator(cursor, operand);

            operand = cursor.create(CustomOperator, operand, row);
            hasCustomOperator = true;
        }


        if ( hasCustomOperator ) {
            return this.parseCustomOperator(
                cursor, operand, options
            );
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
            CurrentDate, TimestampLiteral,
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

                const syntax = cursor.create(Syntax, operand, row);
                return syntax;
            }

            const functionCall = cursor.create(
                FunctionCall, functionNameReference,
                FunctionCall.parseAfterName(cursor, functionNameReference)
            );
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
        operator: string,
        right: Operand
    ) {
        if (
            left.is(BinaryOperator) &&
            left.lessPrecedence(operator)
        ) {
            return cursor.create(BinaryOperator, left, {
                left: left.row.left,
                operator: left.row.operator,
                right: cursor.create(BinaryOperator, left.row.right, {
                    left: left.row.right,
                    operator,
                    right
                })
            });
        }

        return cursor.create(BinaryOperator, left, {
            left,
            operator,
            right
        });
    }

    template(): TemplateElement[] {
        return [this.row.operand];
    }

    operand(): Operand {
        return this.row.operand;
    }
}
