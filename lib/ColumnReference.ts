import { AbstractNode, Cursor } from "abstract-lang";
import { Name } from "./Name";
import { NameOrStar } from "./NameOrStar";

export type ColumnReferenceNames = (
    [] |
    [Name] |
    [Name, Name] |
    [Name, Name, Name]
);

export interface ColumnReferenceRow {
    column: ColumnReferenceNames;
    allColumns?: true;
}

export class ColumnReference extends AbstractNode<ColumnReferenceRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(NameOrStar);
    }

    static parse(cursor: Cursor): ColumnReferenceRow {
        const names = cursor.parseChainOf(NameOrStar, ".");
        if ( names.length === 4 ) {
            cursor.throwError(
                `cross-database references are not implemented: ${names.join(".")}`,
                names[0]
            );
        }
        else if ( names.length > 4 ) {
            cursor.throwError(
                `improper qualified name (too many dotted names): ${names.join(".")}`,
                names[ names.length - 1 ]
            );
        }

        const column = names
            .filter((nameOrStar) => !nameOrStar.isStar())
            .map((nameOrStar) =>
                (nameOrStar.row as {name: Name}).name
            ) as ColumnReferenceNames;

        const invalidStar = names.slice(0, -1)
            .find((nameOrStar) => nameOrStar.isStar());
        if ( invalidStar ) {
            cursor.throwError(
                "improper use of \"*\"",
                invalidStar
            );
        }

        const allColumns = names[ names.length - 1 ].isStar();
        if ( allColumns ) {
            return {column, allColumns};
        }
        return {column};
    }

    template(): string {
        let output = this.row.column.join(".");
        if ( this.row.allColumns ) {
            if ( this.row.column.length > 0 ) {
                output += ".*";
            }
            else {
                output = "*";
            }
        }
        return output;
    }
}