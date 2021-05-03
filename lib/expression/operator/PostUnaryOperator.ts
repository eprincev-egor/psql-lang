import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "../Operand";

const IS_NULL = "is null";
const IS_NOT_NULL = "is not null";
export type PostUnaryOperatorType = (
    typeof IS_NULL |
    typeof IS_NOT_NULL
);

export interface PostUnaryOperatorRow {
    operand: Operand;
    postOperator: PostUnaryOperatorType;
}

export class PostUnaryOperator extends AbstractNode<PostUnaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("is", "not", "null") ||
            cursor.beforePhrase("is", "null") ||
            cursor.beforeWord("isnull") ||
            cursor.beforeWord("notnull")
        );
    }

    static parseOperator(cursor: Cursor): PostUnaryOperatorType {
        if ( cursor.beforeWord("isnull") ) {
            cursor.readWord("isnull");
            return IS_NULL;
        }

        if ( cursor.beforeWord("notnull") ) {
            cursor.readWord("notnull");
            return IS_NOT_NULL;
        }

        if ( cursor.beforePhrase("is", "null") ) {
            cursor.readPhrase("is", "null");
            return IS_NULL;
        }

        cursor.readPhrase("is", "not", "null");
        return IS_NOT_NULL;
    }

    template(): TemplateElement[] {
        return [this.row.operand, " ", this.row.postOperator];
    }
}