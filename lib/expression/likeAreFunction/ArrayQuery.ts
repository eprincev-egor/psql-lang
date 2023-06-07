import {
    AbstractNode, Cursor,
    TemplateElement, keyword, eol, tab
} from "abstract-lang";
import { likeAreFunction } from "./likeAreFunction";
import { Select } from "../../select";

export interface ArrayQueryRow {
    array: Select;
}

export class ArrayQuery extends AbstractNode<ArrayQueryRow> {

    static parseContent(cursor: Cursor): ArrayQueryRow {
        const select = cursor.parse(Select);
        return {array: select};
    }

    template(): TemplateElement[] {
        return [
            keyword("array"), "(", eol,
            tab, this.row.array, eol,
            ")"
        ];
    }
}

likeAreFunction.array = ArrayQuery;