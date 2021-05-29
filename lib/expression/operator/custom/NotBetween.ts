import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface NotBetweenRow {
    operand: Operand;
    symmetric?: true;
    notBetween: Operand;
    and: Operand;
}

export class NotBetween extends AbstractNode<NotBetweenRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("not", "between");
    }

    static parseOperator(cursor: Cursor, operand: Operand): NotBetweenRow {
        cursor.readPhrase("not", "between");

        let symmetric = false;
        if ( cursor.beforeWord("symmetric") ) {
            cursor.readWord("symmetric");
            symmetric = true;
        }

        const notBetween = Expression.parse(cursor, {
            stopOnOperators: ["and"]
        }).operand;

        cursor.readWord("and");

        const and = Expression.parse(cursor, {
            stopOnOperators: [
                "or", "<", ">", "<=", ">=", "=", "and"
            ]
        }).operand;

        const row: NotBetweenRow = {
            operand,
            notBetween,
            and
        };
        if ( symmetric ) {
            row.symmetric = true;
        }
        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            this.row.operand, _,
            keyword("not"), keyword("between"), _
        ];

        if ( this.row.symmetric ) {
            output.push( keyword("symmetric") );
        }

        output.push(
            this.row.notBetween, _,
            keyword("and"), _,
            this.row.and
        );

        return output;
    }
}

customOperators.push(NotBetween);