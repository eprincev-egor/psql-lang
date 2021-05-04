import {
    AbstractNode, Cursor,
    TemplateElement, keyword, tab, eol
} from "abstract-lang";
import { Select } from "../../select";
import { likeAreFunction } from "./likeAreFunction";

export interface ExistsRow {
    exists: Select;
}

export class Exists extends AbstractNode<ExistsRow> {

    static parseContent(cursor: Cursor): ExistsRow {
        const exists = cursor.parse(Select);
        return {exists};
    }

    template(): TemplateElement[] {
        return [
            keyword("exists"), "(", eol,
            tab, this.row.exists, eol,
            ")"
        ];
    }
}

likeAreFunction.exists = Exists;