import {
    Cursor,
    TemplateElement,
    eol, keyword, tab, _
} from "abstract-lang";
import { AbstractFromItem, FromItemRow } from "./AbstractFromItem";
import { Name } from "../base";
import { Select } from "./Select";

export interface FromSubQueryRow extends FromItemRow {
    subQuery: Select;
    as: Name;
}

// TODO:
// select *
// from (values (1, 'hello')) as company(id, name)

export class FromSubQuery extends AbstractFromItem<FromSubQueryRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("(");
    }

    static parse(cursor: Cursor): FromSubQueryRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const subQuery = cursor.parse(Select);

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        cursor.readWord("as");
        const as = cursor.parse(Name);

        return {subQuery, as};
    }

    template(): TemplateElement[] {
        return [
            "(", eol,
            tab, this.row.subQuery, eol,
            ")",
            _, keyword("as"), this.row.as
        ];
    }
}