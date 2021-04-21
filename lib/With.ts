import {
    AbstractNode, Cursor,
    TemplateElement,
    keyword, eol, printTabChain
} from "abstract-lang";
import { WithQuery } from "./WithQuery";

export interface WithRow {
    recursive?: true;
    queries: WithQuery[];
}

export class With extends AbstractNode<WithRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("with");
    }

    static parse(cursor: Cursor): WithRow {
        cursor.readWord("with");

        let recursive = false;
        if ( cursor.beforeWord("recursive") ) {
            cursor.readWord("recursive");
            recursive = true;
        }

        const queries = cursor.parseChainOf(WithQuery, ",");
        if ( recursive ) {
            return {recursive, queries};
        }

        return {queries};
    }

    template(): TemplateElement[] {
        return [
            keyword("with"), eol,
            ...printTabChain(this.row.queries, ",", eol)
        ];
    }
}