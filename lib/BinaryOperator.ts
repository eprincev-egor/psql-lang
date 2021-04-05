import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Operand } from "./Operand";

const BINARY_OPERATORS = [
    "=", "<>", "!=", "<", ">", "<=", ">=", "||", "!", "!!", "%", "@", "-", "<<", "&<", "&>", ">>",
    "<@", "@>", "~=", "&&", ">^", "<^", "@@", "*", "<->", "/", "+", "#=", "#<>", "#<", "#>",
    "#<=", "#>=", "<?>", "|/", "||/", "|", "<#>", "~", "!~", "#", "?#", "@-@", "?-", "?|", "^",
    "~~", "!~~", "~*", "!~*", "|>>", "<<|", "?||", "?-|", "##", "&", "<<=", ">>=", "~~*",
    "!~~*", "~<~", "~<=~", "~>=~", "~>~", "&<|", "|&>", "@@@", "*=", "*<>", "*<", "*>", "*<=",
    "*>=", "-|-", "->", "->>", "#>>", "?", "?&", "#-", "::",
    "or", "and"
] as const;
export type BinaryOperatorType = (typeof BINARY_OPERATORS)[number];

export interface BinaryOperatorRow {
    left: Operand;
    operator: BinaryOperatorType;
    right: Operand;
}

export class BinaryOperator extends AbstractNode<BinaryOperatorRow> {

    template(): TemplateElement[] {
        const {left, operator, right} = this.row;
        if ( operator === "or" || operator === "and" ) {
            return [left, ` ${operator} `, right];
        }
        return [left, _, operator, _, right];
    }
}