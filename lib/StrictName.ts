import { AbstractNode, Cursor } from "abstract-lang";
import { UEscape } from "./UEscape";
import { escapeUnicodes } from "./utils";

export interface StrictNameRow {
    strictName: string;
    unicodeEscape?: string;
}

export class StrictName extends AbstractNode<StrictNameRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeValue("\"") ||
            cursor.beforeValue("u") ||
            cursor.beforeValue("U")
            // string[1] === "&" &&
            // string[2] === "\""
        );
    }

    static parse(cursor: Cursor): StrictNameRow {
        let unicodeEscape: string | undefined;

        if ( cursor.beforeValue("u") || cursor.beforeValue("U") ) {
            cursor.readWord("u");
            cursor.readValue("&");
            unicodeEscape = "\\";
        }

        const strictName = this.parseName(cursor);

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

    private static parseName(cursor: Cursor): string {
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

    template(): string {
        if ( this.row.unicodeEscape ) {
            if ( this.row.unicodeEscape === "\\" ) {
                return `U&"${this.row.strictName}"`;
            }

            return `U&"${this.row.strictName}" uescape '${this.row.unicodeEscape}'`;
        }

        return `"${this.row.strictName}"`;
    }

    toValue(): string {
        if ( this.row.unicodeEscape ) {
            return escapeUnicodes(
                this.row.strictName.replace(/""/g, "\""),
                this.row.unicodeEscape
            );
        }

        return this.row.strictName.replace(/""/g, "\"");
    }
}
