import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Operand } from "./Operand";

const BINARY_OPERATORS = [
    "=", "<>", "!=", "<", ">", "<=", ">=", "||", "!", "!!", "%", "@", "-", "<<", "&<", "&>", ">>",
    "<@", "@>", "~=", "&&", ">^", "<^", "@@", "*", "<->", "/", "+", "#=", "#<>", "#<", "#>",
    "#<=", "#>=", "<?>", "|/", "||/", "|", "<#>", "~", "!~", "#", "?#", "@-@", "?-", "?|", "^",
    "~~", "!~~", "~*", "!~*", "|>>", "<<|", "?||", "?-|", "##", "&", "<<=", ">>=", "~~*",
    "!~~*", "~<~", "~<=~", "~>=~", "~>~", "&<|", "|&>", "@@@", "*=", "*<>", "*<", "*>", "*<=",
    "*>=", "-|-", "->", "->>", "#>>", "?", "?&", "#-", "::"
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
        return [left, _, operator, _, right];
    }
}