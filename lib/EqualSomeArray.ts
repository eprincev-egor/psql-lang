import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

export interface EqualSomeArrayRow {
    operand: Operand;
    someArray: Expression;
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