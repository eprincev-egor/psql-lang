import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface DollarStringTagRow {
    tag: string;
}

export class DollarStringTag extends AbstractNode<DollarStringTagRow> {

    static entry(cursor: Cursor): boolean {
        // little speedup
        if ( !cursor.beforeValue("$") ) {
            return false;
        }
        if ( cursor.beforeSequence("$", "$") ) {
            return true;
        }
        if ( !cursor.beforeSequence("$", WordToken) ) {
            return false;
        }

        const startToken = cursor.nextToken;
        cursor.readValue("$");
        cursor.readAll(WordToken, DigitsToken);

        const hasClose$ = cursor.beforeValue("$");
        cursor.setPositionBefore(startToken);

        return hasClose$;
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