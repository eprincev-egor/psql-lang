import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Operand } from "./Expression";

export interface EqualAnyArrayRow {
    operand: Operand;
    anyArray: Operand;
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