import {
    AbstractNode, Cursor,
    TemplateElement, eol, keyword
} from "abstract-lang";
import { Expression, Operand } from "../Expression";

export interface CaseWhenElementRow {
    when: Operand;
    then: Operand;
}

export class CaseWhenElement extends AbstractNode<CaseWhenElementRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("when");
    }

    static parse(cursor: Cursor): CaseWhenElementRow {
        cursor.readWord("when");
        const when = cursor.parse(Expression).operand();

        cursor.readWord("then");
        const then = cursor.parse(Expression).operand();

        return {when, then};
    }

    template(): TemplateElement[] {
        return [
            keyword("when"), this.row.when, eol,
            keyword("then"), this.row.then
        ];
    }
}