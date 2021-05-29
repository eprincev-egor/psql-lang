import {
    AbstractNode, Cursor,
    TemplateElement, keyword
} from "abstract-lang";
import { Name } from "../../../base";
import { Operand } from "./../../Expression";
import { customOperators } from "./customOperators";

export interface CollateRow {
    operand: Operand;
    collate: Name;
}

export class Collate extends AbstractNode<CollateRow> {

    static entryOperator(cursor: Cursor): boolean {
        return cursor.beforeWord("collate");
    }

    static parseOperator(cursor: Cursor, operand: Operand): CollateRow {
        cursor.readWord("collate");
        const collate = cursor.parse(Name);
        return {operand, collate};
    }

    template(): TemplateElement[] {
        return [
            this.row.operand,
            keyword("collate"),
            this.row.collate
        ];
    }
}

customOperators.push(Collate);