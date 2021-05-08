import {
    Cursor,
    keyword,
    TemplateElement
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { TableReference } from "./TableReference";

export interface FromTableRow extends FromItemRow {
    only?: true;
    all?: true;
    table: TableReference;
}

// TODO: TABLESAMPLE

export class FromTable extends AbstractFromItem<FromTableRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(TableReference);
    }

    static parse(cursor: Cursor): FromTableRow {
        let only = false;
        if ( cursor.beforeWord("only") ) {
            cursor.readWord("only");
            only = true;
        }

        const table = cursor.parse(TableReference);
        const row: FromTableRow = {
            table
        };
        if ( only ) {
            row.only = true;
        }

        if ( cursor.beforeValue("*") ) {
            cursor.readValue("*");
            row.all = true;
        }

        const otherParams = super.parseOther(cursor);
        Object.assign(row, otherParams);

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.only ) {
            output.push( keyword("only") );
        }
        output.push( this.row.table );
        if ( this.row.all ) {
            output.push(" *");
        }

        super.printOther(output);
        return output;
    }
}