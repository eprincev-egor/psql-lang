import { AbstractNode, Cursor, keyword, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "./Expression";

export type FetchType = "first" | "next";
export interface FetchRow {
    type: FetchType;
    count?: Operand;
}

export class Fetch extends AbstractNode<FetchRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("fetch");
    }

    static parse(cursor: Cursor): FetchRow {
        cursor.readWord("fetch");

        const row: FetchRow = {
            type: this.parseType(cursor)
        };

        if ( !cursor.beforeWord("row") && !cursor.beforeWord("rows") ) {
            row.count = cursor.parse(Expression).operand();
        }

        if ( cursor.beforeWord("row") ) {
            cursor.readWord("row");
        }
        else {
            cursor.readWord("rows");
        }
        cursor.readWord("only");

        return row;
    }

    private static parseType(cursor: Cursor): FetchType {
        if ( cursor.beforeWord("next") ) {
            cursor.readWord("next");
            return "next";
        }
        else {
            cursor.readWord("first");
            return "first";
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            keyword("fetch"),
            keyword(this.row.type)
        ];

        if ( this.row.count ) {
            output.push(this.row.count);
        }

        output.push(
            keyword("rows"),
            keyword("only")
        );
        return output;
    }
}