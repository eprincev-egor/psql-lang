import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "../../Expression";
import { customOperators } from "./customOperators";

export interface BetweenRow {
    operand: Operand;
    symmetric?: true;
    between: Operand;
    and: Operand;
}

export class Between extends AbstractNode<BetweenRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeWord("between");
    }

    static parseOperator(cursor: Cursor, operand: Operand): BetweenRow {
        cursor.readWord("between");

        let symmetric = false;
        if ( cursor.beforeWord("symmetric") ) {
            cursor.readWord("symmetric");
            symmetric = true;
        }

        const between = Expression.parse(cursor, {
            stopOnOperators: ["and"]
        }).operand;

        cursor.readWord("and");

        const and = Expression.parse(cursor, {
            stopOnOperators: [
                "or", "<", ">", "<=", ">=", "=", "and"
            ]
        }).operand;

        const row: BetweenRow = {
            operand,
            between,
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
            keyword("between"), _
        ];

        if ( this.row.symmetric ) {
            output.push( keyword("symmetric") );
        }

        output.push(
            this.row.between, _,
            keyword("and"), _,
            this.row.and
        );

        return output;
    }
}

customOperators.push(Between);