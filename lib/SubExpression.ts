import { Cursor, TemplateElement } from "abstract-lang";
import { ExpressionRow } from "./Expression";
import assert from "assert";
import { cycle } from "./Operand";

assert.ok( cycle.Expression );

export class SubExpression extends cycle.Expression {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("(");
    }

    static parse(cursor: Cursor): ExpressionRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const {operand} = super.parse(cursor);

        cursor.skipSpaces();
        cursor.readValue(")");

        return {operand};
    }

    template(): TemplateElement[] {
        return ["(", this.row.operand, ")"];
    }
}

cycle.SubExpression = SubExpression;