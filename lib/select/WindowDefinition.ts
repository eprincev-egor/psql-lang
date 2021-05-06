import {
    AbstractNode, Cursor,
    TemplateElement, keyword, printChain, eol, tab
} from "abstract-lang";
import { Name } from "../base";
import { Expression, Operand } from "../expression";
import { OrderByItem } from "./OrderByItem";
import { WindowDefinitionFrame } from "./WindowDefinitionFrame";

export interface WindowDefinitionRow {
    existingWindow?: Name;
    partitionBy?: Operand[];
    orderBy?: OrderByItem[];
    frame?: WindowDefinitionFrame;
}

/*
window_definition is
[ existing_window_name ]
[ PARTITION BY expression [, ...] ]
[ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ frame_clause ]

The frame_clause can be one of
{ RANGE | ROWS } frame_start
{ RANGE | ROWS } BETWEEN frame_start AND frame_end

where frame_start and frame_end can be one of
UNBOUNDED PRECEDING
value PRECEDING
CURRENT ROW
value FOLLOWING
UNBOUNDED FOLLOWING
*/
export class WindowDefinition extends AbstractNode<WindowDefinitionRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): WindowDefinitionRow {
        const row: WindowDefinitionRow = {};

        // [ existing_window_name ]
        const word = cursor.nextToken.value.toLowerCase();
        if ( !["partition", "order", "range", "rows"].includes(word) ) {
            row.existingWindow = cursor.parse(Name);
            cursor.skipSpaces();
        }

        // [ PARTITION BY expression [, ...] ]
        if ( cursor.beforeWord("partition") ) {
            cursor.readPhrase("partition", "by");

            row.partitionBy = cursor.parseChainOf(Expression, ",")
                .map((expr) => expr.operand());
        }

        // [ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
        if ( cursor.beforeWord("order") ) {
            cursor.readPhrase("order", "by");

            row.orderBy = cursor.parseChainOf(OrderByItem, ",");
            cursor.skipSpaces();
        }

        // { RANGE | ROWS } frame_start
        // { RANGE | ROWS } BETWEEN frame_start AND frame_end
        if ( cursor.before(WindowDefinitionFrame) ) {
            row.frame = cursor.parse(WindowDefinitionFrame);
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.existingWindow ) {
            output.push( this.row.existingWindow );
        }

        if ( this.row.partitionBy ) {
            if ( output.length > 0 ) {
                output.push(eol);
            }

            output.push(
                keyword("partition"), keyword("by"), eol,
                tab, ...printChain(this.row.partitionBy, ",", eol, tab)
            );
        }

        if ( this.row.orderBy ) {
            if ( output.length > 0 ) {
                output.push(eol);
            }

            output.push(
                keyword("order"), keyword("by"), eol,
                tab, ...printChain(this.row.orderBy, ",", eol, tab)
            );
        }

        if ( this.row.frame ) {
            if ( output.length > 0 ) {
                output.push(eol);
            }
            output.push( this.row.frame );
        }

        return output;
    }
}