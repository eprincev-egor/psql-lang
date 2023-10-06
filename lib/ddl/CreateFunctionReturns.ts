import {
    AbstractNode, Cursor,
    TemplateElement,
    eol,
    keyword, printChain, tab
} from "abstract-lang";
import { PgType } from "../expression";
import { CreateFunctionArgument } from "./CreateFunctionArgument";

export type CreateFunctionReturnsRow = {
    setOf?: boolean;
} & ({
    type: PgType;
} | {
    table: CreateFunctionArgument[];
});


export class CreateFunctionReturns extends AbstractNode<CreateFunctionReturnsRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("returns");
    }

    static parse(cursor: Cursor): CreateFunctionReturnsRow {
        cursor.readWord("returns");

        let setOf = false;
        if ( cursor.beforeWord("setof") ) {
            cursor.readWord("setof");
            setOf = true;
        }

        if ( cursor.beforeWord("table") ) {
            cursor.readWord("table");
            cursor.readValue("(");
            cursor.skipSpaces();

            const table = cursor.parseChainOf(CreateFunctionArgument, ",");

            cursor.skipSpaces();
            cursor.readValue(")");
            cursor.skipSpaces();

            return {setOf, table};
        }

        const type = cursor.parse(PgType);
        return {setOf, type};
    }

    template(): TemplateElement[] {
        const returns = this.row;

        const output: TemplateElement[] = [
            keyword("returns")
        ];

        if ( returns.setOf ) {
            output.push(keyword("setof"));
        }

        if ( "table" in returns ) {
            output.push(keyword("table"), "(");
            if ( returns.table.length === 1 ) {
                output.push(...returns.table);
            }
            else if ( returns.table.length > 0 ) {
                output.push(eol);
                output.push(tab, ...printChain(returns.table, ",", eol, tab));
                output.push(eol);
            }
            output.push(")");
        }
        else {
            output.push(returns.type);
        }

        return output;
    }
}