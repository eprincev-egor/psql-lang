import { AbstractNode, Cursor } from "abstract-lang";
import { NumberLiteral } from "../literal/NumberLiteral";

export const CURRENT_DATE_TYPE = [
    "current_date",
    "current_time",
    "current_timestamp",
    "localtime",
    "localtimestamp"
] as readonly string[];

export interface CurrentDateRow {
    dateType: string;
    precision?: string;
}

export class CurrentDate extends AbstractNode<CurrentDateRow> {

    static entry(cursor: Cursor): boolean {
        const nextWord = cursor.nextToken
            .value.toLowerCase();

        return CURRENT_DATE_TYPE.includes(nextWord);
    }

    static parse(cursor: Cursor): CurrentDateRow {
        const dateType = cursor.readAnyOne()
            .value.toLowerCase();
        const row: CurrentDateRow = {dateType};

        cursor.skipSpaces();
        if ( cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();
            row.precision = cursor.parse(NumberLiteral).toString();
            cursor.skipSpaces();
            cursor.readValue(")");
        }
        return row;
    }

    template(): string {
        if ( this.row.precision ) {
            return `${this.row.dateType}(${this.row.precision})`;
        }

        return this.row.dateType;
    }
}