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

        const byteStringTokens = cursor.readAll(WordToken, DigitsToken);

        cursor.readValue("'");

        for (const token of byteStringTokens) {
            let notValidChar: RegExpExecArray | null | undefined;

            if ( base === "binary" ) {
                notValidChar = /[^01]/.exec(token.value);
            }
            if ( base === "hexadecimal" ) {
                notValidChar = /[^\da-f]/i.exec(token.value);
            }

            if ( notValidChar ) {
                cursor.throwError(
                    `"${notValidChar[0]}" is not a valid ${base} digit`,
                    token
                );
            }
        }

        const byteString = byteStringTokens
            .join("")
            .toLowerCase();

        return {base, byteString};
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