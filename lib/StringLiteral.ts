import { AbstractNode, Cursor, EndOfLineToken, SpaceToken } from "abstract-lang";
import { DollarStringTag } from "./DollarStringTag";
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
} | {
    string: string;
    tag: string;
}

export class StringLiteral extends AbstractNode<StringLiteralRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("'") ||
            cursor.beforeValue("u") ||
            cursor.beforeValue("U") ||
            cursor.beforeValue("e") ||
            cursor.beforeValue("E") ||
            cursor.before(DollarStringTag)
        );
    }

    static parse(cursor: Cursor): StringLiteralRow {

        if ( cursor.before(DollarStringTag) ) {
            const tag = cursor.parse(DollarStringTag).row.tag;
            const string = this.parseDollarString(cursor, tag);

            return {string, tag};
        }

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

    private static parseDollarString(cursor: Cursor, tag: string) {

        let string = "";
        while ( !cursor.beforeEnd() ) {

            if ( cursor.before(DollarStringTag) ) {
                const tagNode = cursor.parse(DollarStringTag);
                if ( tagNode.row.tag === tag ) {
                    break;
                }

                string += tagNode.toString();
                continue;
            }

            string += cursor.nextToken.value;
            cursor.skipOne();
        }

        return string;
    }

    template(): string {
        if ( "tag" in this.row ) {
            const {tag, string} = this.row;
            return `$${tag}$${string}$${tag}$`;
        }
        else if ( "escape" in this.row ) {
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
        if ( "tag" in this.row ) {
            return this.row.string;
        }
        else if ( "escape" in this.row ) {
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
