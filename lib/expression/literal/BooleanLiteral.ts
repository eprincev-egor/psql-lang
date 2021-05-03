import { AbstractNode, Cursor } from "abstract-lang";

export interface BooleanRow {
    boolean: boolean;
}

export class BooleanLiteral extends AbstractNode<BooleanRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("true") ||
            cursor.beforeWord("false")
        );
    }

    static parse(cursor: Cursor): BooleanRow {
        if ( cursor.beforeWord("true") ) {
            cursor.readWord("true");
            return {boolean: true};
        }
        else {
            cursor.readWord("false");
            return {boolean: false};
        }
    }

    template(): string {
        return this.row.boolean.toString();
    }
}