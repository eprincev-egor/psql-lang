import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Name } from "./Name";

export interface TableReferenceRow {
    schema?: Name;
    name: Name;
}

export class TableReference extends AbstractNode<TableReferenceRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): TableReferenceRow {
        const names = cursor.parseChainOf(Name, ".");

        if ( names.length > 2 ) {
            cursor.throwError(
                "table reference should be two names or one",
                names[ names.length - 1 ]
            );
        }

        if ( names.length === 2 ) {
            return {
                schema: names[0],
                name: names[1]
            };
        }

        return {name: names[0]};
    }

    template(): TemplateElement[] {
        if ( this.row.schema ) {
            return [this.row.schema, ".", this.row.name];
        }

        return [this.row.name];
    }
}