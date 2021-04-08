import {
    AbstractNode,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

export interface NotInOperatorRow {
    operand: Operand;
    notIn: Expression[];
}

export class NotInOperator extends AbstractNode<NotInOperatorRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            " not in", _, "(",
            ...printChain(this.row.notIn, ",", _),
            ")"
        ];
    }
}