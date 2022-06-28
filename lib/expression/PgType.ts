import {
    AbstractNode, Cursor,
    DigitsToken, WordToken
} from "abstract-lang";
import { Name } from "../base";

export interface PgTypeRow {
    type: string;
}

const MULTI_WORD_TYPES = [
    "double precision",
    "timestamp without time zone",
    "timestamp with time zone",
    "time without time zone",
    "time with time zone",
    "bit varying",
    "character varying"
].map((typeName) => typeName.split(" "))
    .sort((phraseA, phraseB) =>
        phraseB.length - phraseA.length
    );

const CAN_BE_MULTI_WORD: {[firstWord: string]: boolean} = {};
for (const phrase of MULTI_WORD_TYPES) {
    const firstWord = phrase[0];
    CAN_BE_MULTI_WORD[ firstWord ] = true;
}

const TYPES_WITH_SIZE = new Set([
    "bit varying",
    "character varying",
    "bit",
    "char",
    "character",
    "varchar",
    "numeric",
    "decimal"
]);

export class PgType extends AbstractNode<PgTypeRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(WordToken) ||
            cursor.before(Name)
        );
    }

    static parse(cursor: Cursor): PgTypeRow {
        let type = this.parseTypeName(cursor);

        if ( cursor.beforeValue("(") && TYPES_WITH_SIZE.has(type) ) {
            type += this.parseSize(cursor);
        }

        if ( cursor.beforeValue("[") ) {
            type += this.parseArrayBrackets(cursor);
        }

        cursor.skipSpaces();
        return {type};
    }

    private static parseTypeName(cursor: Cursor): string {
        let typeName = "";

        if ( cursor.beforeValue("\"") ) {
            const nameSyntax = cursor.parse(Name);
            typeName = nameSyntax.toString();
        }
        else {
            const beginToken = cursor.nextToken;
            typeName = cursor.readAll(WordToken, DigitsToken)
                .join("").toLowerCase();

            cursor.skipSpaces();
            const endToken = cursor.nextToken;

            if ( CAN_BE_MULTI_WORD[ typeName ] ) {
                cursor.setPositionBefore(beginToken);

                let hasLongName = false;
                for (const phrase of MULTI_WORD_TYPES) {
                    if ( cursor.beforePhrase(...phrase) ) {
                        typeName = cursor.readPhrase(...phrase).join(" ");
                        hasLongName = true;
                        break;
                    }
                }
                if ( !hasLongName ) {
                    cursor.setPositionBefore(endToken);
                }

                typeName = typeName.toLowerCase();
            }
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