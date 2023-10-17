import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { IntervalType, intervals, intervalsAliases } from "./intervals";

export interface MakeIntervalArgumentRow {
    interval?: MakeIntervalArgumentIntervalType;
    value: Operand;
}
export type MakeIntervalArgumentIntervalType = (
    IntervalType |
    keyof typeof intervalsAliases
);

export class MakeIntervalArgument extends AbstractNode<MakeIntervalArgumentRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): MakeIntervalArgumentRow {
        const nextToken = cursor.nextToken.value.toLowerCase();
        if ( intervals.includes(nextToken as any) || nextToken in intervalsAliases ) {
            cursor.next();
            cursor.skipSpaces();

            if ( cursor.beforeValue(":") ) {
                cursor.readValue(":");
                cursor.readValue("=");
            }
            else {
                cursor.readValue("=");
                cursor.readValue(">");
            }
            cursor.skipSpaces();

            const value = cursor.parse(Expression).operand();
            return {
                interval: nextToken as MakeIntervalArgumentIntervalType,
                value
            };
        }

        const value = cursor.parse(Expression).operand();
        return {value};
    }

    template(): TemplateElement[] {
        if ( this.row.interval ) {
            return [
                keyword(this.row.interval),
                _, "=>", _,
                this.row.value
            ];
        }

        return [this.row.value];
    }
}