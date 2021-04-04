import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export type ByteStringBase = "binary" | "hexadecimal";
export interface ByteStringLiteralRow {
    base: ByteStringBase;
    byteString: string;
}

export class ByteStringLiteral extends AbstractNode<ByteStringLiteralRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeSequence("b", "'") ||
            cursor.beforeSequence("B", "'") ||
            cursor.beforeSequence("x", "'") ||
            cursor.beforeSequence("X", "'")
        );
    }

    static parse(cursor: Cursor): ByteStringLiteralRow {
        const base = this.parseBase(cursor);

        cursor.readValue("'");

        const byteString = cursor.readAll(WordToken, DigitsToken).join("");

        cursor.readValue("'");

        if ( base === "binary" ) {
            const notValidChar = /[^01]/.exec(byteString);
            if ( notValidChar ) {
                cursor.throwError(`"${notValidChar[0]}" is not a valid binary digit`);
            }
        }
        if ( base === "hexadecimal" ) {
            const notValidChar = /[^\da-f]/i.exec(byteString);
            if ( notValidChar ) {
                cursor.throwError(`"${notValidChar[0]}" is not a valid hexadecimal digit`);
            }
        }

        return {
            base,
            byteString: byteString.toLowerCase()
        };
    }

    private static parseBase(cursor: Cursor): ByteStringBase {
        if ( cursor.beforeWord("x") ) {
            cursor.readWord("x");
            return "hexadecimal";
        }

        cursor.readWord("b");
        return "binary";
    }

    template(): string {
        const output = this.row.base === "binary" ?
            `B'${this.row.byteString}'` :
            `X'${this.row.byteString}'`;
        return output;
    }
}