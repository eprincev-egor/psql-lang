import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _, printChain
} from "abstract-lang";
import { MakeIntervalArgument } from "./MakeIntervalArgument";

export interface MakeIntervalRow {
    intervalArguments: MakeIntervalArgument[];
}

export class MakeInterval extends AbstractNode<MakeIntervalRow> {

    static parseArguments(cursor: Cursor): MakeIntervalArgument[] {
        const args = cursor.parseChainOf(MakeIntervalArgument, ",");
        return args;
    }

    template(): TemplateElement[] {
        return [
            keyword("make_interval"), "(",
            ...printChain(this.row.intervalArguments, ",", _),
            ")"
        ];
    }
}