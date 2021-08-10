import { AbstractNode, Cursor, keyword, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "../expression";
import { Name } from "../base";
import { keywords } from "./keywords";

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
        else if ( cursor.before(Name) ) {
            const word = cursor.nextToken.value.toLowerCase();

            if ( !keywords.includes(word) ) {
                const as = cursor.parse(Name);
                return {expression, as};
            }
        }

        return {expression};
    }

    template(): TemplateElement[] {
        if ( this.row.as && this.row.hasOwnProperty("as") ) {
            return [
                this.row.expression,
                keyword("as"),
                this.row.as
            ];
        }

        return [this.row.expression];
    }
}