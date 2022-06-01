import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { StringLiteral } from "./literal/StringLiteral";
import { PgType } from "./PgType";
import { Expression, Operand } from "./Expression";

export interface TimestampRow {
    type: string;
    timestamp: Operand;
}

export class Timestamp extends AbstractNode<TimestampRow> {

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

        const endsWithValid = (
            cursor.before(StringLiteral) ||
            cursor.beforeValue("(")
        );

        cursor.setPositionBefore(startToken);
        return endsWithValid;
    }

    static parse(cursor: Cursor): TimestampRow {
        const type = cursor.parse(PgType).row.type;
        cursor.skipSpaces();

        const timestamp = cursor.parse(Expression).operand();
        return {type, timestamp};
    }

    template(): TemplateElement[] {
        return [this.row.type, " ", this.row.timestamp];
    }
}