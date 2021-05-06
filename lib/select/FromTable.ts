import {
    Cursor,
    TemplateElement,
    printChain, eol, keyword
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { Join } from "./Join";
import { Name } from "../base";
import { TableReference } from "./TableReference";

export interface FromTableRow extends FromItemRow {
    table: TableReference;
}

export class FromTable extends AbstractFromItem<FromTableRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(TableReference);
    }

    static parse(cursor: Cursor): FromTableRow {
        const table = cursor.parse(TableReference);
        const row: FromTableRow = {
            table
        };

        if ( cursor.beforeWord("as") ) {
            cursor.readWord("as");
            row.as = cursor.parse(Name);
        }

        if ( cursor.before(Join) ) {
            row.joins = cursor.parseChainOf(Join);
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            this.row.table
        ];
        if ( this.row.as ) {
            output.push( keyword("as"), this.row.as );
        }

        if ( this.row.joins ) {
            output.push(eol, eol);
            output.push(...printChain(this.row.joins, eol, eol));
        }

        return output;
    }
}