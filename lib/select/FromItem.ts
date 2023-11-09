import { Cursor } from "abstract-lang";
import { FromFunction } from "./FromFunction";
import { FromSubQuery } from "./FromSubQuery";
import { FromTable } from "./FromTable";
import { FromValues } from "./FromValues";

export type FromItemType = (
    FromTable |
    FromSubQuery |
    FromValues |
    FromFunction
);

export function parseFromItem(cursor: Cursor): FromItemType {
    const fromItem: FromItemType = cursor.parseOneOf([
        FromValues,
        FromSubQuery,
        FromFunction,
        FromTable
    ], "expected from item");

    return fromItem;
}

export function parseFromItems(cursor: Cursor, delimiter = ","): FromItemType[] {
    const fromItems: FromItemType[] = [];

    do {
        const fromItem = parseFromItem(cursor);
        fromItems.push(fromItem);

        cursor.skipSpaces();

        if ( !cursor.beforeValue(delimiter) ) {
            break;
        }
        cursor.readValue(delimiter);
        cursor.skipSpaces();

    } while ( !cursor.beforeEnd() );

    return fromItems;
}
