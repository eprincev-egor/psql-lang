import { AbstractNode, Cursor, TemplateElement, _, eol, printChain, tab } from "abstract-lang";
import { Name } from "../base";
import { Select, ValueItem } from "../select";

export type SetItemRow = {
    column: Name;
    value: ValueItem;
} | {
    columns: Name[];
    values: ValueItem[];
}| {
    columns: Name[];
    select: Select;
}

export class SetItem extends AbstractNode<SetItemRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("(") ||
            cursor.before(Name)
        );
    }

    static parse(cursor: Cursor): SetItemRow {
        if ( cursor.before(Name) ) {
            const column = cursor.parse(Name);

            cursor.skipSpaces();
            cursor.readValue("=");
            cursor.skipSpaces();

            const value = cursor.parse(ValueItem);

            return {column, value};
        }

        cursor.readValue("(");
        cursor.skipSpaces();

        const columns = cursor.parseChainOf(Name, ",");

        cursor.skipSpaces();
        cursor.readPhrase(")", "=", "(");

        if ( cursor.before(Select) ) {
            const select = cursor.parse(Select);

            cursor.skipSpaces();
            cursor.readValue(")");

            return {columns, select};
        }

        const values = cursor.parseChainOf(ValueItem, ",");

        cursor.skipSpaces();
        cursor.readValue(")");

        return {columns, values};
    }

    template(): TemplateElement[] {
        const set = this.row;

        if ( "column" in set ) {
            return [set.column, _, "=", _, set.value];
        }

        const output: TemplateElement[] = [
            "(", eol,
            tab, ...printChain(set.columns, ",", eol, tab), eol,
            ")", _, "=", _, "(", eol
        ];

        if ( "select" in set ) {
            output.push(tab, set.select, eol);
        }
        else {
            output.push(
                tab, ...printChain(set.values, ",", eol, tab), eol
            );
        }

        output.push(")");
        return output;
    }
}