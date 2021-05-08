import { Cursor } from "abstract-lang";
import { FromSubQuery } from "./FromSubQuery";
import { FromTable } from "./FromTable";
import { FromValues } from "./FromValues";

export type FromItemType = (
    FromTable |
    FromSubQuery |
    FromValues
);

export function parseFromItem(cursor: Cursor): FromItemType {
    const fromItem: FromItemType = cursor.parseOneOf([
        FromValues,
        FromSubQuery,
        FromTable
    ], "expected from item");

    return fromItem;
}