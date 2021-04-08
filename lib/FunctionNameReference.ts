import { AbstractNode } from "abstract-lang";
import { ColumnReference } from "./ColumnReference";
import { Name } from "./Name";

export type FunctionNames = (
    [Name] |
    [Name, Name]
);

export interface FunctionNameReferenceRow {
    function: FunctionNames;
}

export class FunctionNameReference extends AbstractNode<FunctionNameReferenceRow> {

    static from(
        columnReference: ColumnReference
    ): FunctionNameReference {
        const names = columnReference.row.column;

        const isValidNamesLength = (
            names.length === 1 ||
            names.length === 2
        );
        if ( !isValidNamesLength ) {
            throw new Error([
                "cannot convert column reference to function reference,",
                `invalid length: ${names.length}`
            ].join(" "));
        }

        return new FunctionNameReference({
            position: columnReference.position,
            row: {
                function: names as FunctionNames
            }
        });
    }

    template(): string {
        return this.row.function.join(".");
    }
}