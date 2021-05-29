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
            cursor.beforeSequence("u", "&", "\"") ||
            cursor.beforeSequence("U", "&", "\"")
        );
    }

    static parse(cursor: Cursor): NameRow {
        if (
            cursor.beforePhrase("u", "&") ||
            cursor.beforeValue("\"")
        ) {
            return this.parseStrictName(cursor);
        }

        return this.parseLowerName(cursor);
    }

    private static parseStrictName(cursor: Cursor): NameRow {
        let unicodeEscape: string | undefined;

        if ( cursor.beforePhrase("u", "&") ) {
            cursor.readPhrase("u", "&");
            unicodeEscape = "\\";
        }

        const strictName = this.parseQuotedName(cursor);
        cursor.skipSpaces();

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

            strictName += cursor.readAnyOne().value;
        }

        return strictName;
    }

    private static parseLowerName(cursor: Cursor): NameRow {

        const nameTokens = cursor.readAll(WordToken, DigitsToken);
        const name = nameTokens.join("");

        if ( /\d/.test(name[0]) ) {
            cursor.throwError(
                `name should starts with alphabet char, invalid name: ${name}`,
                nameTokens[0]
            );
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

    equal(otherName: Name): boolean {
        return this.toValue() === otherName.toValue();
    }
}