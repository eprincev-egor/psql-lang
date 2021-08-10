import { AbstractNode, AnyRow, Cursor, NodeParams } from "abstract-lang";
import { Operand } from "../../Operand";

export interface CustomOperatorType<TNode extends AbstractNode<AnyRow>> {
    entryOperator(cursor: Cursor): boolean;
    parseOperator(cursor: Cursor, left: Operand): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export const customOperators: CustomOperatorType<any>[] = [];
