import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Name } from "./Name";

export interface SchemaNameRow {
    database?: Name;
    schema?: Name;
    name: Name;
}

export class SchemaName extends AbstractNode<SchemaNameRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): SchemaNameRow {
        const names = cursor.parseChainOf(Name, ".");
        return this.namesToRow(cursor, names);
    }

    static namesToRow(cursor: Cursor, names: Name[]): SchemaNameRow {
        if ( names.length > 3 ) {
            cursor.throwError(
                `improper qualified name (too many dotted names): ${names.join(".")}`,
                names[ names.length - 1 ]
            );
        }

        if ( names.length === 3 ) {
            return {
                database: names[0],
                schema: names[1],
                name: names[2]
            };
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
        if ( this.row.database && this.row.schema ) {
            return [
                this.row.database, ".",
                this.row.schema, ".",
                this.row.name
            ];
        }

        if ( this.row.schema ) {
            return [this.row.schema, ".", this.row.name];
        }

        return [this.row.name];
    }

    toLowerCase(): string {
        return this.toString().toLowerCase();
    }
}