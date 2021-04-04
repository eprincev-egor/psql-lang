import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface DollarStringTagRow {
    tag: string;
}

export class DollarStringTag extends AbstractNode<DollarStringTagRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeSequence("$", "$") ||
            cursor.beforeSequence("$", WordToken, "$") ||
            cursor.beforeSequence("$", WordToken, DigitsToken, "$")
        );
    }

    static parse(cursor: Cursor): DollarStringTagRow {
        let tag = "";

        cursor.readValue("$");

        if ( cursor.beforeValue("$") ) {
            cursor.readValue("$");
        }
        else {
            tag += cursor.readAll(WordToken, DigitsToken).join("");
            cursor.readValue("$");
        }

        if ( /^\d/.test(tag) ) {
            cursor.throwError(`dollar tag should starts with alphabet char, invalid tag: ${tag}`);
        }

        return {tag};
    }

    template(): string {
        return `$${this.row.tag}$`;
    }
}