import { AbstractNode, TemplateElement, _ } from "abstract-lang";
import { Expression } from "./Expression";
import { Operand } from "./Operand";

export interface NotInOperatorRow {
    operand: Operand;
    notIn: Expression[];
}

// TODO: refactor with InOperator (duplicated code)
export class NotInOperator extends AbstractNode<NotInOperatorRow> {

    template(): TemplateElement[] {
        return [
            this.row.operand,
            " not in", _, "(",
            ...this.printNotInElements(),
            ")"
        ];
    }

    private printNotInElements() {
        const inElements: TemplateElement[] = [];
        for (const element of this.row.notIn) {
            if ( inElements.length > 0 ) {
                inElements.push(",", _);
            }
            inElements.push(element);
        }

        return inElements;
    }
}