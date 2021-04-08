import {
    AbstractNode,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

export interface InOperatorRow {
    operand: Operand;
    in: Expression[];
}

export class InOperator extends AbstractNode<InOperatorRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            " in", _, "(",
            ...printChain(this.row.in, ",", _),
            ")"
        ];
    }
}