import { AbstractNode, Cursor, keyword, TemplateElement } from "abstract-lang";
import { Expression } from "./Expression";

export type ValueItemRow = {
    default: true;
} | {
    value: Expression;
};

export class ValueItem extends AbstractNode<ValueItemRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): ValueItemRow {
        if ( cursor.beforeWord("default") ) {
            cursor.readValue("default");
            return {default: true};
        }
        else {
            const value = cursor.parse(Expression);
            return {value};
        }
    }

    template(): TemplateElement {
        if ( "default" in this.row ) {
            return keyword("default");
        }
        else {
            return this.row.value;
        }
    }
}