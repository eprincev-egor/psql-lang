import {
    AbstractNode, Cursor,
    TemplateElement, _, keyword, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { GroupByElementContent } from "./GroupByElementContent";

export type GroupByElementRow = {
    empty: true;
} | {
    expression: Expression;
} | {
    rollup: GroupByElementContent[];
} | {
    cube: GroupByElementContent[];
} | {
    groupingSets: GroupByElement[];
}

export class GroupByElement extends AbstractNode<GroupByElementRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): GroupByElementRow {
        if ( cursor.beforePhrase("(", ")") ) {
            cursor.readPhrase("(", ")");
            return {empty: true};
        }

        if ( cursor.beforeWord("rollup") ) {
            return this.parseRollup(cursor);
        }
        else if ( cursor.beforeWord("cube") ) {
            return this.parseCube(cursor);
        }
        else if ( cursor.beforeWord("grouping") ) {
            return this.parseGroupingSets(cursor);
        }
        else {
            const expression = cursor.parse(Expression);
            return {expression};
        }
    }

    private static parseRollup(cursor: Cursor): GroupByElementRow {
        cursor.readWord("rollup");
        cursor.readValue("(");
        cursor.skipSpaces();

        const rollup = cursor.parseChainOf(GroupByElementContent, ",");

        cursor.skipSpaces();
        cursor.readValue(")");

        return {rollup};
    }

    private static parseCube(cursor: Cursor): GroupByElementRow {
        cursor.readWord("cube");
        cursor.readValue("(");
        cursor.skipSpaces();

        const cube = cursor.parseChainOf(GroupByElementContent, ",");

        cursor.skipSpaces();
        cursor.readValue(")");

        return {cube};
    }

    private static parseGroupingSets(cursor: Cursor): GroupByElementRow {
        cursor.readWord("grouping");
        cursor.readWord("sets");
        cursor.readValue("(");
        cursor.skipSpaces();

        const groupingSets = cursor.parseChainOf(GroupByElement, ",");

        cursor.skipSpaces();
        cursor.readValue(")");

        return {groupingSets};
    }

    template(): TemplateElement[] {
        if ( "empty" in this.row ) {
            return ["()"];
        }
        else if ( "rollup" in this.row ) {
            return [
                keyword("rollup"), _, "(",
                ...printChain(this.row.rollup, ",", _),
                ")"
            ];
        }
        else if ( "cube" in this.row ) {
            return [
                keyword("cube"), _, "(",
                ...printChain(this.row.cube, ",", _),
                ")"
            ];
        }
        else if ( "groupingSets" in this.row ) {
            return [
                keyword("grouping"), keyword("sets"), _, "(",
                ...printChain(this.row.groupingSets, ",", _),
                ")"
            ];
        }
        else {
            return [this.row.expression];
        }
    }
}