import {
    AbstractNode, Cursor,
    TemplateElement,
    _, eol, tab, keyword, printChain
} from "abstract-lang";
import { Expression } from "./Expression";
import { SelectColumn } from "./SelectColumn";
import { FromTable } from "./FromTable";

export interface SelectRow {
    select: SelectColumn[];
    from: FromTable[];
    where?: Expression;
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
            cursor.readWord("from");
            selectRow.from = cursor.parseChainOf(FromTable, ",");
        }

        if ( cursor.beforeWord("where") ) {
            cursor.readWord("where");
            selectRow.where = cursor.parse(Expression);
        }

        return selectRow;
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
            output.push(eol, keyword("from"));
            output.push(...printChain(this.row.from, ",", _));
        }

        if ( this.row.where ) {
            output.push(
                eol,
                keyword("where"), eol,
                tab, this.row.where
            );
        }

        return output;
    }
}