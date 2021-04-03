import { AbstractNode, Cursor } from "abstract-lang";

export interface NullRow {
    null: true;
}

export class NullLiteral extends AbstractNode<NullRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("null");
    }

    static parse(cursor: Cursor): NullRow {
        cursor.readWord("null");
        return {null: true};
    }

    // eslint-disable-next-line class-methods-use-this
    template(): string {
        return "null";
    }
}