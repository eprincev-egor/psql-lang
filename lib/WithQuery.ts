import {
    AbstractNode, Cursor,
    TemplateElement,
    keyword, tab, eol, _
} from "abstract-lang";
import { Name } from "./Name";
import { Select } from "./Select";

export interface WithQueryRow {
    name: Name;
    query: Select;
}

export class WithQuery extends AbstractNode<WithQueryRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): WithQueryRow {
        const name = cursor.parse(Name);

        cursor.skipSpaces();
        cursor.readWord("as");
        cursor.readValue("(");
        cursor.skipSpaces();

        const query = cursor.parse(Select);

        cursor.skipSpaces();
        cursor.readValue(")");

        return {name, query};
    }

    template(): TemplateElement[] {
        return [
            this.row.name, keyword("as"), _, "(", eol,
            tab, this.row.query, eol,
            ")"
        ];
    }
}