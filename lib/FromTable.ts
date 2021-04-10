import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { TableReference } from "./TableReference";

export interface FromRow {
    table: TableReference;
}

export class FromTable extends AbstractNode<FromRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(TableReference);
    }

    static parse(cursor: Cursor): FromRow {
        const table = cursor.parse(TableReference);
        return {table};
    }

    template(): TemplateElement {
        return this.row.table;
    }
}