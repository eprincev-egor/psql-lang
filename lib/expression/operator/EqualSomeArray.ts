import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Operand } from "../Expression";

export interface EqualSomeArrayRow {
    operand: Operand;
    someArray: Operand;
}

export class EqualSomeArray extends AbstractNode<EqualSomeArrayRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "=", _,
            "some(", this.row.someArray, ")"
        ];
    }
}