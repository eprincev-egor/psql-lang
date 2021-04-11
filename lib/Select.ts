import {
    AbstractNode, Cursor,
    TemplateElement,
    _, eol, tab, keyword, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { SelectColumn } from "./SelectColumn";
import { OrderByItem } from "./OrderByItem";
import { FromItemType, parseFromItem } from "./FromItem";

export interface SelectRow {
    select: SelectColumn[];
    from: FromItemType[];
    where?: Expression;
    orderBy?: OrderByItem[];
}

export class Select extends AbstractNode<SelectRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("select");
    }

    static parse(cursor: Cursor): SelectRow {
        cursor.readWord("select");

        const selectRow: SelectRow = {
            select: [],
            from: []
        };

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
        const output: TemplateElement[] = [keyword("select")];

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

        return output;
    }
}