import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface VariableRow {
    variable: string;
}

export class Variable extends AbstractNode<VariableRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("$");
    }

    static parse(cursor: Cursor): VariableRow {
        cursor.readValue("$");

        let variable = "";
        while ( !cursor.beforeEnd() ) {
            if ( cursor.beforeToken(WordToken) ) {
                variable += cursor.read(WordToken).value;
            }
            else if ( cursor.beforeToken(DigitsToken) ) {
                variable += cursor.read(DigitsToken).value;
            }
            else {
                break;
            }
        }

        return {variable};
    }

    template(): string {
        return `$${this.row.variable}`;
    }
}