import {
    AbstractNode, Cursor,
    DigitsToken, EndOfLineToken, SpaceToken, WordToken
} from "abstract-lang";
import { Name } from "../base";

export interface PgTypeRow {
    type: string;
}

export class PgType extends AbstractNode<PgTypeRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(WordToken) ||
            cursor.before(Name)
        );
    }

    static parse(cursor: Cursor): PgTypeRow {
        let type = this.parseTypeName(cursor);

        if ( cursor.beforeValue("(") ) {
            type += this.parseSize(cursor);
        }

        if ( cursor.beforeValue("[") ) {
            type += this.parseArrayBrackets(cursor);
        }

        return {type};
    }

    private static parseTypeName(cursor: Cursor): string {
        let typeName = "";

        if ( cursor.beforeValue("\"") ) {
            const nameSyntax = cursor.parse(Name);
            typeName = nameSyntax.toString();
        }
        else {
            typeName = cursor.readAll(
                WordToken, DigitsToken,
                SpaceToken, EndOfLineToken
            ).join("");

            typeName = typeName
                .split(/\s+/).join(" ")
                .trim()
                .toLowerCase();

        }

        if ( cursor.beforeValue(".") ) {
            cursor.readValue(".");
            cursor.skipSpaces();

            const secondName = this.parseTypeName(cursor);
            return typeName + "." + secondName;
        }

        return typeName;
    }

    private static parseSize(cursor: Cursor) {
        cursor.readValue("(");
        cursor.skipSpaces();

        const sizes: string[] = [];
        while ( !cursor.beforeEnd() ) {
            const size = cursor.read(DigitsToken).value;
            sizes.push(size);

            cursor.skipSpaces();

            if ( cursor.beforeValue(",") ) {
                cursor.readValue(",");
                cursor.skipSpaces();
            }
            else {
                break;
            }
        }

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        return `(${sizes.join(", ")})`;
    }

    private static parseArrayBrackets(cursor: Cursor): string {
        let output = "[";

        cursor.readValue("[");
        cursor.skipSpaces();

        if ( cursor.beforeToken(DigitsToken) ) {
            output += cursor.read(DigitsToken).value;
            cursor.skipSpaces();
        }

        cursor.readValue("]");
        cursor.skipSpaces();

        output += "]";

        if ( cursor.beforeValue("[") ) {
            return output + this.parseArrayBrackets(cursor);
        }

        return output;
    }

    template(): string {
        return this.row.type;
    }
}