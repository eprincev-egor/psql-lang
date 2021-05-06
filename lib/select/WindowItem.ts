import {
    AbstractNode, Cursor,
    TemplateElement, keyword, eol, tab, _
} from "abstract-lang";
import { Name } from "../base";
import { WindowDefinition } from "./WindowDefinition";

export interface WindowItemRow {
    window: WindowDefinition;
    as: Name;
}

export class WindowItem extends AbstractNode<WindowItemRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Name);
    }

    static parse(cursor: Cursor): WindowItemRow {
        const as = cursor.parse(Name);

        cursor.skipSpaces();
        cursor.readPhrase("as", "(");

        const window = cursor.parse(WindowDefinition);

        cursor.skipSpaces();
        cursor.readValue(")");

        return {window, as};
    }

    template(): TemplateElement[] {
        return [
            this.row.as, keyword("as"), _, "(", eol,
            tab, this.row.window, eol,
            ")"
        ];
    }
}