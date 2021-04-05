import { AbstractNode, Cursor, TemplateElement } from "abstract-lang";
import { Operand } from "./Operand";

export interface PostUnaryOperatorRow {
    operand: Operand;
    postOperator: string;
}

export class PostUnaryOperator extends AbstractNode<PostUnaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforePhrase("is", "not", "null");
    }

    static parseOperator(cursor: Cursor): string {
        return cursor.readPhrase("is", "not", "null").join(" ");
    }

    template(): TemplateElement[] {
        return [this.row.operand, " ", this.row.postOperator];
    }
}