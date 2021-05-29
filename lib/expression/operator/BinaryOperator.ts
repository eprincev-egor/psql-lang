/* eslint-disable sonarjs/no-duplicate-string */
import {
    AbstractNode, Cursor,
    OperatorsToken, WordToken,
    TemplateElement, _, keyword
} from "abstract-lang";
import { NumberLiteral } from "../literal/NumberLiteral";
import { Operand } from "../Operand";
import { PreUnaryOperator } from "./PreUnaryOperator";

// https://www.postgresql.org/docs/9.6/sql-syntax-lexical.html
// Table 4-2. Operator Precedence (highest to lowest)
const OPERATORS_PRECEDENCE = [
    ["^"],
    ["*", "%", "/"],
    ["+", "-"],
    [], // all other native and user-defined operators
    ["like", "ilike", "similar", "not similar", "not like", "not ilike"],
    ["=", "!=", "<>", "<", "<=", ">=", ">"],
    ["is distinct from", "is not distinct from"],
    ["and"],
    ["or"]
] as const;

const PRECEDENCE_BY_OPERATOR: {[operator: string]: number} = {};
for (let i = 0, n = OPERATORS_PRECEDENCE.length; i < n; i++) {
    const operators = OPERATORS_PRECEDENCE[ i ];
    for (const operator of operators) {
        PRECEDENCE_BY_OPERATOR[ operator ] = OPERATORS_PRECEDENCE.length - i - 1;
    }
}

const DEFAULT_PRECEDENCE = OPERATORS_PRECEDENCE
    .slice().reverse()
    .findIndex((operators) => operators.length === 0);

function calcPrecedence(operator: string) {
    const precedence = PRECEDENCE_BY_OPERATOR[ operator ];
    return precedence === undefined ? DEFAULT_PRECEDENCE : precedence;
}

export interface BinaryOperatorRow {
    left: Operand;
    operator: string;
    right: Operand;
}

export class BinaryOperator extends AbstractNode<BinaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(OperatorsToken) ||
            cursor.beforeValue(":") ||
            cursor.beforeValue("`") ||
            cursor.beforeValue("#") ||
            cursor.beforeWord("or") ||
            cursor.beforeWord("and") ||
            cursor.beforeWord("ilike") ||
            cursor.beforeWord("like") ||
            cursor.beforeWord("similar") ||
            cursor.beforePhrase("not", "ilike") ||
            cursor.beforePhrase("not", "like") ||
            cursor.beforePhrase("not", "similar") ||
            cursor.beforePhrase("is", "distinct", "from") ||
            cursor.beforePhrase("is", "not", "distinct", "from")
        ) &&
        !cursor.beforeSequence("/", "*") &&
        !cursor.beforeSequence("-", "-");
    }

    static parseOperator(cursor: Cursor): string {
        if ( cursor.beforePhrase("not", "ilike") ) {
            cursor.readPhrase("not", "ilike");
            return "not ilike";
        }

        if ( cursor.beforePhrase("not", "like") ) {
            cursor.readPhrase("not", "like");
            return "not like";
        }

        if ( cursor.beforePhrase("not", "similar") ) {
            cursor.readPhrase("not", "similar");
            return "not similar";
        }

        if ( cursor.beforePhrase("is", "distinct", "from") ) {
            cursor.readPhrase("is", "distinct", "from");
            return "is distinct from";
        }

        if ( cursor.beforePhrase("is", "not", "distinct", "from") ) {
            cursor.readPhrase("is", "not", "distinct", "from");
            return "is not distinct from";
        }

        if ( cursor.beforeToken(WordToken) ) {
            return cursor.read(WordToken).value.toLowerCase();
        }

        return this.readOperatorChars(cursor);
    }

    private static readOperatorChars(cursor: Cursor): string {
        let operator = "";

        while ( !cursor.beforeEnd() ) {
            const isOperatorChar = (
                cursor.beforeToken(OperatorsToken) ||
                cursor.beforeValue(":") ||
                cursor.beforeValue("#") ||
                cursor.beforeValue("`")
            );

            const needStop = (
                operator.length > 0 &&
                (
                    cursor.nextToken.value === "+" ||
                    cursor.nextToken.value === "-"
                ) &&
                !/[!#%&?@^`|~]/.test(operator)
            );
            if ( needStop || !isOperatorChar ) {
                break;
            }

            operator += cursor.readAnyOne().value;
        }

        return operator;
    }

    lessPrecedence(someOperator: string): boolean {
        return calcPrecedence(this.row.operator) < calcPrecedence(someOperator);
    }

    template(): TemplateElement[] {
        const {left, operator, right} = this.row;

        if ( /\w/.test(operator) ) {
            return [left, _, keyword(operator), _, right];
        }

        if (
            /[!#%&?@^`|~]/.test(operator) && (
                right.is(PreUnaryOperator) ||
                right.is(NumberLiteral) &&
                right.row.number[0] === "-"
            )
        ) {
            return [left, _, operator, " ", right];
        }

        return [left, _, operator, _, right];
    }
}