import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { StringLiteral } from "./StringLiteral";
import { PgType } from "../PgType";

export interface TimestampLiteralRow {
    type: string;
    timestamp: StringLiteral;
}

export class TimestampLiteral extends AbstractNode<TimestampLiteralRow> {

    static entry(cursor: Cursor): boolean {
        const startsWithDateType = (
            cursor.beforeWord("timestamp") ||
            cursor.beforeWord("date") ||
            cursor.beforeWord("time")
        );
        if ( !startsWithDateType ) {
            return false;
        }

        const startToken = cursor.nextToken;
        cursor.parse(PgType);

        const endsWithString = cursor.before(StringLiteral);

        cursor.setPositionBefore(startToken);
        return endsWithString;
    }

    static parse(cursor: Cursor): TimestampLiteralRow {
        const type = cursor.parse(PgType).row.type;
        cursor.skipSpaces();
        const timestamp = cursor.parse(StringLiteral);

        return {type, timestamp};
    }

    template(): TemplateElement[] {
        return [this.row.type, " ", this.row.timestamp];
    }
}