import { AbstractNode, Cursor, EndOfLineToken } from "abstract-lang";

export interface JsTemplateValueRow {
    jsTemplateValue: string;
}

export class JsTemplateValue extends AbstractNode<JsTemplateValueRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeSequence("$", "{");
    }

    static parse(cursor: Cursor): JsTemplateValueRow {
        const startToken = cursor.nextToken;

        cursor.readPhrase("$", "{");

        let openedBrackets = 0;

        while ( !cursor.beforeEnd() ) {

            if ( cursor.before(JsTemplateValue) ) {
                cursor.parse(JsTemplateValue);
            }

            this.skipAnyComment(cursor);

            if ( cursor.beforeValue("\"") || cursor.beforeValue("'") ) {
                this.skipString(cursor);
            }

            if ( cursor.beforeValue("`") ) {
                this.skipTemplateLiteral(cursor);
            }

            const token = cursor.readAnyOne();

            if ( token.value === "{" ) {
                openedBrackets++;
            }

            if ( token.value === "}" ) {
                if ( openedBrackets === 0 ) {
                    break;
                }

                openedBrackets--;
            }
        }

        const endToken = cursor.nextToken;
        const jsTemplateValue = cursor.source.tokens.join("").slice(
            startToken.position + 2,
            endToken.position - 1
        );
        return {jsTemplateValue};
    }

    private static skipAnyComment(cursor: Cursor) {
        if ( cursor.beforeSequence("/", "/") ) {
            this.skipInlineComment(cursor);
        }

        if ( cursor.beforeSequence("/", "*") ) {
            this.skipMultilineComment(cursor);
        }
    }

    private static skipInlineComment(cursor: Cursor) {
        cursor.readValue("/");
        cursor.readValue("/");
        while (
            !cursor.beforeToken(EndOfLineToken) &&
            !cursor.beforeEnd()
        ) {
            cursor.next();
        }
    }

    private static skipMultilineComment(cursor: Cursor) {
        cursor.readValue("/");
        cursor.readValue("*");

        while ( !cursor.beforeEnd() ) {
            if ( cursor.beforeSequence("*", "/") ) {
                cursor.readValue("*");
                cursor.readValue("/");
                break;
            }

            cursor.next();
        }
    }

    private static skipString(cursor: Cursor) {
        const quotes = cursor.nextToken.value;
        cursor.readAnyOne();

        while ( !cursor.beforeEnd() ) {
            const token = cursor.readAnyOne();

            if ( token.value === "\\" ) {
                cursor.readAnyOne();
                continue;
            }

            if ( token.value === quotes ) {
                break;
            }
        }
    }

    private static skipTemplateLiteral(cursor: Cursor) {
        cursor.readAnyOne();

        while ( !cursor.beforeEnd() ) {
            if ( cursor.before(JsTemplateValue) ) {
                cursor.parse(JsTemplateValue);
                continue;
            }

            const token = cursor.readAnyOne();

            if ( token.value === "\\" ) {
                cursor.readAnyOne();
                continue;
            }

            if ( token.value === "`" ) {
                break;
            }
        }
    }

    template(): string {
        return `\${${this.row.jsTemplateValue}}`;
    }
}