import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _, printChain
} from "abstract-lang";
import { MakeIntervalArgument } from "./MakeIntervalArgument";
import { likeAreFunction } from "./likeAreFunction";

export interface MakeIntervalRow {
    intervalArguments: MakeIntervalArgument[];
}

export class MakeInterval extends AbstractNode<MakeIntervalRow> {

    static parseContent(cursor: Cursor): MakeIntervalRow {
        const intervalArguments = cursor.parseChainOf(MakeIntervalArgument, ",");
        return {intervalArguments};
    }

    template(): TemplateElement[] {
        return [
            keyword("make_interval"), "(",
            ...printChain(this.row.intervalArguments, ",", _),
            ")"
        ];
    }
}

likeAreFunction.make_interval = MakeInterval;