import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";
import { UEscape } from "./UEscape";
import { escapeUnicodes } from "./utils";

export type NameRow = {
    name: string;
} | {
    strictName: string;
    unicodeEscape?: string;
};

export class Name extends AbstractNode<NameRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(WordToken) ||
            cursor.beforeValue("\"") ||
            cursor.beforeValue("u") ||
            cursor.beforeValue("U")
        );
    }

    static parse(cursor: Cursor): NameRow {
        if (
            cursor.beforeValue("u") ||
            cursor.beforeValue("U") ||
            cursor.beforeValue("\"")
        ) {
            return this.parseStrictName(cursor);
        }

        return this.parseLowerName(cursor);
    }

    private static parseStrictName(cursor: Cursor): NameRow {
        let unicodeEscape: string | undefined;

        if ( cursor.beforeValue("u") || cursor.beforeValue("U") ) {
            cursor.readWord("u");
            cursor.readValue("&");
            unicodeEscape = "\\";
        }

        const strictName = this.parseQuotedName(cursor);

        if ( cursor.before(UEscape) ) {
            if ( !unicodeEscape ) {
                cursor.throwError("unexpected uescape, use u& before quotes");
            }

            unicodeEscape = cursor.parse(UEscape).row.escape;
        }

        if ( unicodeEscape ) {
            return {strictName, unicodeEscape};
        }

        return {strictName};
    }

    private static parseQuotedName(cursor: Cursor): string {
        let strictName = "";

        cursor.readValue("\"");

        while ( !cursor.beforeEnd() ) {

            if ( cursor.beforeValue("\"") ) {
                cursor.skipOne();

                if ( cursor.beforeValue("\"") ) {
                    strictName += "\"\"";
                    cursor.skipOne();
                    continue;
                }

                break;
            }

            strictName += cursor.nextToken.value;
            cursor.skipOne();
        }

        return strictName;
    }

    private static parseLowerName(cursor: Cursor): NameRow {

        let name = "";
        while ( !cursor.beforeEnd() ) {
            if ( cursor.beforeToken(WordToken) ) {
                name += cursor.read(WordToken).value;
            }
            else if ( cursor.beforeToken(DigitsToken) ) {
                name += cursor.read(DigitsToken).value;
            }
            else {
                break;
            }
        }

        if ( /^\d/.test(name) ) {
            cursor.throwError(`name should starts with alphabet char, invalid name: ${name}`);
        }

        return {name: name.toLowerCase()};
    }

    template(): string {
        if ( "strictName" in this.row ) {
            if ( this.row.unicodeEscape ) {
                if ( this.row.unicodeEscape === "\\" ) {
                    return `U&"${this.row.strictName}"`;
                }

                return `U&"${this.row.strictName}" uescape '${this.row.unicodeEscape}'`;
            }

            return `"${this.row.strictName}"`;
        }

        return this.row.name;
    }

    toValue(): string {
        if ( "name" in this.row ) {
            return this.row.name;
        }

        if ( this.row.unicodeEscape ) {
            return escapeUnicodes(
                this.row.strictName.replace(/""/g, "\""),
                this.row.unicodeEscape
            );
        }

        return this.row.strictName.replace(/""/g, "\"");
    }
}