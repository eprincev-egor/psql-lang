import { AbstractNode, Cursor } from "abstract-lang";

export interface UEscapeRow {
    escape: string;
}

export class UEscape extends AbstractNode<UEscapeRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("uescape");
    }

    static parse(cursor: Cursor): UEscapeRow {

        let escape = "\\";
        cursor.readWord("uescape");

        cursor.readValue("'");
        escape = cursor.nextToken.value;

        if ( /[\d"'+-\sa-f]/.test(escape) ) {
            cursor.throwError("The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character");
        }

        cursor.skipOne();
        cursor.readValue("'");

        return {escape};
    }

    template(): string {
        return `uescape '${this.row.escape}'`;
    }
}