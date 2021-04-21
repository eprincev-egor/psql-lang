import { AbstractNode, Cursor, keyword, OperatorsToken, TemplateElement, WordToken } from "abstract-lang";
import { Expression } from "./Expression";

export type OrderByVectorType = "asc" | "desc";
export type OrderByNullsType = "first" | "last";
export interface OrderByItemRow {
    expression: Expression;
    vector: OrderByVectorType;
    nulls?: OrderByNullsType;
}

export class OrderByItem extends AbstractNode<OrderByItemRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): OrderByItemRow {
        const itemRow: OrderByItemRow = {
            expression: cursor.parse(Expression),
            vector: this.parseVector(cursor)
        };

        if ( cursor.beforeWord("nulls") ) {
            itemRow.nulls = this.parseNulls(cursor);
        }

        return itemRow;
    }

    private static parseVector(cursor: Cursor): OrderByVectorType {
        if ( cursor.beforeWord("using") ) {
            cursor.readWord("using");
            const operatorTokens = cursor.readAll(OperatorsToken);
            const operator = operatorTokens.join("");

            cursor.skipSpaces();

            if ( operator === ">" ) {
                return "desc";
            }
            else if ( operator === "<" ) {
                return "asc";
            }
            else {
                cursor.throwError(
                    "Ordering operators must be \"<\" or \">\" members of btree operator families",
                    operatorTokens[0]
                );
            }
        }
        else if ( cursor.beforeWord("desc") ) {
            cursor.readWord("desc");
            return "desc";
        }
        else if ( cursor.beforeWord("asc") ) {
            cursor.readWord("asc");
            return "asc";
        }

        return "asc";
    }

    private static parseNulls(cursor: Cursor): OrderByNullsType {
        cursor.readWord("nulls");
        const nullsToken = cursor.read(WordToken);
        const nulls = nullsToken.value.toLowerCase();

        if ( nulls === "first" ) {
            return "first";
        }
        else if ( nulls === "last" ) {
            return "last";
        }
        else {
            cursor.throwError(
                "nulls must be \"first\" or \"last\"",
                nullsToken
            );
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            this.row.expression,
            keyword(this.row.vector)
        ];

        if ( this.row.nulls ) {
            output.push(
                keyword("nulls"),
                keyword(this.row.nulls)
            );
        }

        return output;
    }
}