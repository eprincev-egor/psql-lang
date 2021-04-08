import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

export interface EqualAnyArrayRow {
    operand: Operand;
    anyArray: Expression;
}

export class EqualAnyArray extends AbstractNode<EqualAnyArrayRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            _, "=", _,
            "any(", this.row.anyArray, ")"
        ];
    }
}