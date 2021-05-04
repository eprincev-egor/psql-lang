import {
    AbstractNode, Cursor,
    TemplateElement, keyword
} from "abstract-lang";
import { Name } from "../../base";
import { Operand } from "../Expression";

export interface CollateRow {
    operand: Operand;
    collate: Name;
}

export class Collate extends AbstractNode<CollateRow> {

    static parseCollate(cursor: Cursor, operand: Operand): CollateRow {
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