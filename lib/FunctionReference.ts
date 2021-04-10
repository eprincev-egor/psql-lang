import { Cursor } from "abstract-lang";
import { ColumnReference } from "./ColumnReference";
import { SchemaName } from "./SchemaName";

export class FunctionReference extends SchemaName {

    static fromColumn(
        cursor: Cursor,
        columnReference: ColumnReference
    ): FunctionReference {
        const names = columnReference.row.column;
        const row = this.namesToRow(cursor, names);

        return new FunctionReference({
            position: columnReference.position,
            row
        });
    }
}