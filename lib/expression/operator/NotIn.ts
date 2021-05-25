import {
    AbstractNode,
    TemplateElement, _, printChain, keyword
} from "abstract-lang";
import { Operand } from "../Expression";

export interface NotInRow {
    operand: Operand;
    notIn: Operand[];
}

export class NotIn extends AbstractNode<NotInRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            keyword("not"), keyword("in"), _, "(",
            ...printChain(this.row.notIn, ",", _),
            ")"
        ];
    }
}