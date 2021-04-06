import { AbstractNode, TemplateElement, _ } from "abstract-lang";
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
            ...this.printInElements(),
            ")"
        ];
    }

    private printInElements() {
        const inElements: TemplateElement[] = [];
        for (const element of this.row.in) {
            if ( inElements.length > 0 ) {
                inElements.push(",", _);
            }
            inElements.push(element);
        }

        return inElements;
    }
}