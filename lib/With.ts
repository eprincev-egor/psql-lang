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
        this.validate(cursor, queries);

        if ( recursive ) {
            return {recursive, queries};
        }

        return {queries};
    }

    private static validate(cursor: Cursor, queries: WithQuery[]) {
        // query name must be unique
        const existsName: {[key: string]: boolean} = {};
        for (const query of queries) {
            const name = query.row.name.toString();

            if ( name in existsName ) {
                cursor.throwError(
                    `WITH query name "${ name }" specified more than once`,
                    query.row.name
                );
            }

            existsName[ name ] = true;
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            keyword("with")
        ];

        if ( this.row.recursive ) {
            output.push( keyword("recursive") );
        }
        output.push(eol);
        output.push(
            ...printTabChain(this.row.queries, ",", eol)
        );
        return output;
    }
}