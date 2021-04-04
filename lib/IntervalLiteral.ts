import { AbstractNode, Cursor } from "abstract-lang";
import { StringLiteral } from "./StringLiteral";

export interface IntervalLiteralRow {
    interval: StringLiteral;
}

export class IntervalLiteral extends AbstractNode<IntervalLiteralRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("interval");
    }

    static parse(cursor: Cursor): IntervalLiteralRow {
        cursor.readWord("interval");
        const interval = cursor.parse(StringLiteral);
        return {interval};
    }

    template(): string {
        return `interval ${this.row.interval.toString()}`;
    }
}