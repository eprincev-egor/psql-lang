import {
    AbstractNode,
    TemplateElement, _, printChain
} from "abstract-lang";
import { Operand } from "./Expression";

export interface InOperatorRow {
    operand: Operand;
    in: Operand[];
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