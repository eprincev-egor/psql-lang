import {
    AbstractNode, Cursor,
    TemplateElement,
    _, eol, tab, keyword, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { SelectColumn } from "./SelectColumn";
import { OrderByItem } from "./OrderByItem";
import { FromItemType, parseFromItem } from "./FromItem";
import { With } from "./With";

export interface SelectRow {
    with?: With;
    select: SelectColumn[];
    from: FromItemType[];
    where?: Expression;
    orderBy?: OrderByItem[];
    offset?: Expression;
    limit?: Expression;
}

export class Select extends AbstractNode<SelectRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("select") ||
            cursor.before(With)
        );
    }

    static parse(cursor: Cursor): SelectRow {
        const selectRow: SelectRow = {
            select: [],
            from: []
        };

        if ( cursor.before(With) ) {
            selectRow.with = cursor.parse(With);
        }

        cursor.readWord("select");

        const beforeColumns = (
            !cursor.beforeWord("from") &&
            !cursor.beforeWord("where") &&
            cursor.before(Expression)
        );
        if ( beforeColumns ) {
            selectRow.select = cursor.parseChainOf(SelectColumn, ",");
        }

        if ( cursor.beforeWord("from") ) {
            selectRow.from = this.parseFrom(cursor);
        }

        if ( cursor.beforeWord("where") ) {
            cursor.readWord("where");
            selectRow.where = cursor.parse(Expression);
        }

        if ( cursor.beforeWord("order") ) {
            cursor.readPhrase("order", "by");
            selectRow.orderBy = cursor.parseChainOf(OrderByItem, ",");
        }

        if ( cursor.beforeWord("offset") ) {
            cursor.readWord("offset");
            selectRow.offset = cursor.parse(Expression);
        }

        if ( cursor.beforeWord("limit") ) {
            cursor.readWord("limit");

            if ( cursor.beforeWord("all") ) {
                cursor.readWord("all");
            }
            else {
                selectRow.limit = cursor.parse(Expression);
            }
        }

        return selectRow;
    }

    private static parseFrom(cursor: Cursor) {
        cursor.readWord("from");

        const fromItems: FromItemType[] = [];

        do {
            const fromItem = parseFromItem(cursor);
            fromItems.push(fromItem);

            cursor.skipSpaces();

            if ( !cursor.beforeValue(",") ) {
                break;
            }
            cursor.readValue(",");
            cursor.skipSpaces();

        } while ( !cursor.beforeEnd() );

        return fromItems;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.with ) {
            output.push( this.row.with, eol );
        }

        output.push( keyword("select") );

        if ( this.row.select.length > 0 ) {
            output.push(eol, tab);
            output.push(
                ...printChain(this.row.select, ",", eol, tab)
            );
        }

        if ( this.row.from.length > 0 ) {
            output.push(eol, keyword("from"), _);
            output.push(...printChain(this.row.from, ",", _));
        }

        if ( this.row.where ) {
            output.push(
                eol,
                keyword("where"), eol,
                tab, this.row.where
            );
        }

        if ( this.row.orderBy ) {
            output.push(
                eol,
                keyword("order"), keyword("by")
            );
            output.push(
                ...printChain(this.row.orderBy, ",")
            );
        }

        if ( this.row.offset ) {
            output.push(
                eol, keyword("offset"),
                this.row.offset
            );
        }

        if ( this.row.limit ) {
            output.push(
                eol, keyword("limit"),
                this.row.limit
            );
        }

        return output;
    }
}