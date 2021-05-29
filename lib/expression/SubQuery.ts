import {
    AbstractNode, Cursor,
    TemplateElement, tab, eol
} from "abstract-lang";
import { Select } from "../select";

export interface SubQueryRow {
    subQuery: Select;
}

export class SubQuery extends AbstractNode<SubQueryRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforePhrase("(", "select");
    }

    static parse(cursor: Cursor): SubQueryRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const subQuery = cursor.parse(Select);
        if ( subQuery.row.select.length === 0 ) {
            cursor.throwError(
                "expected one column for subquery",
                subQuery
            );
        }
        if ( subQuery.row.select.length > 1 ) {
            cursor.throwError(
                "subquery must return only one column",
                subQuery.row.select[1]
            );
        }

        cursor.skipSpaces();
        cursor.readValue(")");

        return {subQuery};
    }

    template(): TemplateElement[] {
        return [
            "(", eol,
            tab, this.row.subQuery, eol,
            ")"
        ];
    }
}