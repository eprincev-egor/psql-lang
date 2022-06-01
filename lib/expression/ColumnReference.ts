import { AbstractDependencyNode, Cursor } from "abstract-lang";
import { Name, NameOrStar } from "../base";
import { FromItemType } from "../select/FromItem";
import { FromTable } from "../select/FromTable";

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

export class ColumnReference extends AbstractDependencyNode<ColumnReferenceRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(NameOrStar);
    }

    static parse(cursor: Cursor): ColumnReferenceRow {
        const names = cursor.parseChainOf(NameOrStar, ".");

        if ( names.length > 4 ) {
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

    isDependentOn(fromItem: FromItemType): boolean {
        const firstName = this.row.column[0];
        const secondName = this.row.column[1];
        const thirdName = this.row.column[2];
        if ( !firstName ) {
            return false;
        }

        if ( fromItem.row.hasOwnProperty("as") && fromItem.row.as ) {
            const alias = fromItem.row.as;
            return alias.equal(firstName);
        }

        const {schema, name: table} = (fromItem as FromTable).row.table.row;

        // operation.type.name from operation.operation, operation.type
        if ( schema && secondName && thirdName ) {
            return (
                schema.equal(firstName) &&
                table.equal(secondName)
            );
        }

        // company.name from company
        // company.name from public.company
        if ( table.equal(firstName) ) {
            return true;
        }

        if ( secondName ) {
            // public.company.name from public.company
            if ( schema ) {
                return (
                    schema.equal(firstName) &&
                    table.equal(secondName)
                );
            }
            // public.company.name from company
            else {
                return table.equal(secondName);
            }
        }

        return false;
    }

    last(): Name | undefined {
        return this.row.column.slice(-1)[0];
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