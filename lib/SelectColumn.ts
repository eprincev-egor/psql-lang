import { AbstractNode, Cursor, keyword, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "./Expression";
import { Name } from "./Name";

export interface SelectColumnRow {
    expression: Operand;
    as?: Name;
}

export class SelectColumn extends AbstractNode<SelectColumnRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(Expression);
    }

    static parse(cursor: Cursor): SelectColumnRow {
        const expression = cursor.parse(Expression).operand();
        if ( cursor.beforeWord("as") ) {
            cursor.readWord("as");
            const as = cursor.parse(Name);
            return {expression, as};
        }

        return {expression};
    }

    template(): TemplateElement[] {
        if ( this.row.as ) {
            return [
                this.row.expression,
                keyword("as"),
                this.row.as
            ];
        }

        return [this.row.expression];
    }
}