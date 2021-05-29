import {
    AbstractNode,
    TemplateElement, _, printChain, keyword
} from "abstract-lang";
import { Operand } from "../../Expression";

export interface InRow {
    operand: Operand;
    in: Operand[];
}

export class In extends AbstractNode<InRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            keyword("in"), _, "(",
            ...printChain(this.row.in, ",", _),
            ")"
        ];
    }
}