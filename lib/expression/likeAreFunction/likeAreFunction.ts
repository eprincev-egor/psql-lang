import { AbstractNode, AnyRow, Cursor, NodeParams } from "abstract-lang";

export interface LikeAreFunctionType<TNode extends AbstractNode<AnyRow>> {
    parseContent(cursor: Cursor): TNode["row"];
    new(params: NodeParams<TNode["row"]>): TNode;
}

export const likeAreFunction: {
    [key: string]: LikeAreFunctionType<any>;
} = {};
