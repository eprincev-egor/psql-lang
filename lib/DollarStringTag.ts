import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface DollarStringTagRow {
    tag: string;
}

export class DollarStringTag extends AbstractNode<DollarStringTagRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("$");
    }

    static parse(cursor: Cursor): DollarStringTagRow {
        let tag = "";

        cursor.readValue("$");

        if ( cursor.beforeValue("$") ) {
            cursor.readValue("$");
        }
        else {
            while ( !cursor.beforeEnd() ) {
                if ( cursor.beforeToken(WordToken) ) {
                    tag += cursor.read(WordToken).value;
                }
                else if ( cursor.beforeToken(DigitsToken) ) {
                    tag += cursor.read(DigitsToken).value;
                }
                else {
                    break;
                }
            }
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