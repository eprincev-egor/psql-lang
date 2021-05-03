import { Cursor } from "abstract-lang";
import { FromSubQuery } from "./FromSubQuery";
import { FromTable } from "./FromTable";

export type FromItemType = (
    FromTable |
    FromSubQuery
);

export function parseFromItem(cursor: Cursor): FromItemType {
    const fromItem: FromItemType = cursor.parseOneOf([
        FromSubQuery,
        FromTable
    ], "expected from item");

    return fromItem;
}