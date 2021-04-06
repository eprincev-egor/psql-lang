import { AbstractNode, Cursor, OperatorsToken, TemplateElement, WordToken, _ } from "abstract-lang";
import { Operand } from "./Operand";

const BINARY_OPERATORS = [
    "=", "<>", "!=", "<", ">", "<=", ">=", "||", "!", "!!", "%", "@", "-", "<<", "&<", "&>", ">>",
    "<@", "@>", "~=", "&&", ">^", "<^", "@@", "*", "<->", "/", "+", "#=", "#<>", "#<", "#>",
    "#<=", "#>=", "<?>", "|/", "||/", "|", "<#>", "~", "!~", "#", "?#", "@-@", "?-", "?|", "^",
    "~~", "!~~", "~*", "!~*", "|>>", "<<|", "?||", "?-|", "##", "&", "<<=", ">>=", "~~*",
    "!~~*", "~<~", "~<=~", "~>=~", "~>~", "&<|", "|&>", "@@@", "*=", "*<>", "*<", "*>", "*<=",
    "*>=", "-|-", "->", "->>", "#>>", "?", "?&", "#-", "::",
    "or", "and",
    "like", "ilike",
    "not ilike", "not like",
    "is distinct from",
    "is not distinct from"
] as const;
export type BinaryOperatorType = (typeof BINARY_OPERATORS)[number];

export interface BinaryOperatorRow {
    left: Operand;
    operator: BinaryOperatorType;
    right: Operand;
}

export class BinaryOperator extends AbstractNode<BinaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(OperatorsToken) ||
            cursor.beforeWord("or") ||
            cursor.beforeWord("and") ||
            cursor.beforeWord("ilike") ||
            cursor.beforeWord("like") ||
            cursor.beforePhrase("not", "ilike") ||
            cursor.beforePhrase("not", "like") ||
            cursor.beforePhrase("is", "distinct", "from") ||
            cursor.beforePhrase("is", "not", "distinct", "from")
        );
    }

    static parseOperator(cursor: Cursor): BinaryOperatorType {
        if ( cursor.beforePhrase("not", "ilike") ) {
            cursor.readPhrase("not", "ilike");
            return "not ilike";
        }

        if ( cursor.beforePhrase("not", "like") ) {
            cursor.readPhrase("not", "like");
            return "not like";
        }

        if ( cursor.beforePhrase("is", "distinct", "from") ) {
            cursor.readPhrase("is", "distinct", "from");
            return "is distinct from";
        }

        if ( cursor.beforePhrase("is", "not", "distinct", "from") ) {
            cursor.readPhrase("is", "not", "distinct", "from");
            return "is not distinct from";
        }

        const operator = (
            cursor.beforeToken(WordToken) ?
                cursor.read(WordToken).value.toLowerCase() :
                cursor.readAll(OperatorsToken).join("")
        ) as BinaryOperatorType;
        return operator;
    }

    template(): TemplateElement[] {
        const {left, operator, right} = this.row;
        if ( /\w/.test(operator) ) {
            return [left, ` ${operator} `, right];
        }
        return [left, _, operator, _, right];
    }
}