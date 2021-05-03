import { AbstractNode, Cursor } from "abstract-lang";
import { Name } from "./Name";

export type NameOrStarRow = {
    star: true;
} | {
    name: Name;
};

export class NameOrStar extends AbstractNode<NameOrStarRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("*") ||
            cursor.before(Name)
        );
    }

    static parse(cursor: Cursor): NameOrStarRow {
        if ( cursor.beforeValue("*") ) {
            cursor.readValue("*");
            return {star: true};
        }

        const name = cursor.parse(Name);
        return {name};
    }

    isStar(): this is {row: {star: true}} {
        return "star" in this.row;
    }

    template(): string {
        if ( "star" in this.row ) {
            return "*";
        }

        return this.row.name.toString();
    }
}