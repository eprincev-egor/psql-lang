import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface VariableRow {
    variable: string;
}

export class Variable extends AbstractNode<VariableRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeSequence("$", WordToken) ||
            cursor.beforeSequence("$", DigitsToken)
        );
    }

    static parse(cursor: Cursor): VariableRow {
        cursor.readValue("$");

        const variable = cursor.readAll(WordToken, DigitsToken).join("");

        if ( !variable ) {
            cursor.throwError("expected variable name");
        }

        return {variable};
    }

    template(): string {
        return `$${this.row.variable}`;
    }
}