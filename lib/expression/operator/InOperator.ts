import {
    AbstractNode,
    TemplateElement, _, printChain, keyword
} from "abstract-lang";
import { Operand } from "../Expression";

export type InOperatorRow = {
    operand: Operand;
    in: Operand[];
} | {
    operand: Operand;
    notIn: Operand[];
}

export class InOperator extends AbstractNode<InOperatorRow> {

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            this.row.operand
        ];

        if ( "notIn" in this.row ) {
            output.push(
                keyword("not"), keyword("in"), _, "(",
                ...printChain(this.row.notIn, ",", _)
            );
        }
        else {
            output.push(
                keyword("in"), _, "(",
                ...printChain(this.row.in, ",", _)
            );
        }

        output.push(")");
        return output;
    }
}