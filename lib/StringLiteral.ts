import { AbstractNode, Cursor, EndOfLineToken, SpaceToken } from "abstract-lang";
import { UEscape } from "./UEscape";
import { escapeUnicodes, escapeSpecials } from "./utils";

export type StringLiteralRow = {
    string: string;
} | {
    string: string;
    escape: true;
} | {
    string: string;
    unicodeEscape: string;
}

export class StringLiteral extends AbstractNode<StringLiteralRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("'") ||
            cursor.beforeValue("u") ||
            cursor.beforeValue("U") ||
            cursor.beforeValue("e") ||
            cursor.beforeValue("E")
        );
    }

    static parse(cursor: Cursor): StringLiteralRow {
        let unicodeEscape: string | undefined;
        let escape = false;

        if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
            cursor.readWord("e");
            escape = true;
        }
        else if ( cursor.beforeValue("u") || cursor.beforeValue("U") ) {
            cursor.readWord("u");
            cursor.readValue("&");
            unicodeEscape = "\\";
        }

        const string = this.pareString(cursor, escape);

        if ( cursor.before(UEscape) ) {
            if ( !unicodeEscape ) {
                cursor.throwError("unexpected uescape, use u& before quotes");
            }

            unicodeEscape = cursor.parse(UEscape).row.escape;
        }

        if ( escape ) {
            return {string, escape};
        }
        else if ( unicodeEscape ) {
            return {string, unicodeEscape};
        }

        return {string};
    }

    protected static pareString(cursor: Cursor, escape: boolean): string {
        let string = "";

        cursor.readValue("'");

        while ( !cursor.beforeEnd() ) {

            if ( cursor.beforeValue("\\") && escape ) {
                cursor.skipOne();
                string += "\\";
                string += cursor.nextToken.value;
                cursor.skipOne();
                continue;
            }

            if ( cursor.beforeValue("'") ) {
                cursor.skipOne();

                if ( cursor.beforeValue("'") ) {
                    string += "''";
                    cursor.skipOne();
                    continue;
                }

                break;
            }

            string += cursor.nextToken.value;
            cursor.skipOne();
        }

        cursor.skipAll(EndOfLineToken, SpaceToken);

        if ( cursor.beforeValue("'") ) {
            string += this.pareString(cursor, escape);
        }

        return string;
    }

    template(): string {
        if ( "escape" in this.row ) {
            return `E'${this.row.string}'`;
        }
        else if ( "unicodeEscape" in this.row ) {
            if ( this.row.unicodeEscape === "\\" ) {
                return `U&'${this.row.string}'`;
            }

            return `U&'${this.row.string}' uescape '${this.row.unicodeEscape}'`;
        }

        return `'${this.row.string}'`;
    }

    toValue(): string {
        if ( "escape" in this.row ) {
            return escapeSpecials(this.row.string);
        }
        else if ( "unicodeEscape" in this.row ) {
            return escapeUnicodes(
                this.row.string.replace(/''/g, "'"),
                this.row.unicodeEscape
            );
        }

        return this.row.string.replace(/''/g, "'");
    }
}
