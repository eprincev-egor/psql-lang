import {
    AbstractNode, Cursor,
    printChain, TemplateElement, _
} from "abstract-lang";
import { FunctionReference } from "./FunctionReference";
import { Expression, Operand } from "../Expression";

export interface FunctionCallRow {
    call: FunctionReference;
    arguments: Operand[];
}

export class FunctionCall extends AbstractNode<FunctionCallRow> {

    static parseAfterName(
        cursor: Cursor,
        functionName: FunctionReference
    ): FunctionCall {
        cursor.readValue("(");
        cursor.skipSpaces();

        let args: Operand[] = [];
        if ( !cursor.beforeValue(")") ) {
            args = cursor.parseChainOf(Expression, ",")
                .map((expr) => expr.operand());
        }

        cursor.skipSpaces();
        cursor.readValue(")");

        const functionCall = new FunctionCall({
            position: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                start: functionName.position!.start,
                end: cursor.nextToken.position
            },
            row: {
                call: functionName,
                arguments: args
            }
        });
        return functionCall;
    }

    template(): TemplateElement[] {
        return [
            this.row.call, "(",
            ...printChain(this.row.arguments, ",", _),
            ")"
        ];
    }
}