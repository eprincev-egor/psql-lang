import {
    AbstractNode,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Operand } from "../Expression";

export interface NotInOperatorRow {
    operand: Operand;
    notIn: Operand[];
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