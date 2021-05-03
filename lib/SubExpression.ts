import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Expression, Operand } from "./Expression";
import { cycle } from "./cycle";

export interface SubExpressionRow {
    subExpression: Operand;
}
export class SubExpression extends AbstractNode<SubExpressionRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeValue("(");
    }

    static parse(cursor: Cursor): SubExpressionRow {
        cursor.readValue("(");
        cursor.skipSpaces();

        const subExpression = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readValue(")");

        return {subExpression};
    }

    template(): TemplateElement[] {
        return ["(", this.row.subExpression, ")"];
    }
}

cycle.SubExpression = SubExpression;