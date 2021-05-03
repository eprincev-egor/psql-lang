import {
    AbstractNode, Cursor,
    TemplateElement, keyword, _
} from "abstract-lang";
import { Expression, Operand } from "./Expression";

export interface OverlayRow {
    overlay: Operand;
    placing: Operand;
    from: Operand;
    for?: Operand;
}

export class Overlay extends AbstractNode<OverlayRow> {

    static parseContent(cursor: Cursor): OverlayRow {
        const overlay = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readWord("placing");

        const placing = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        cursor.readWord("from");

        const from = cursor.parse(Expression).operand();
        cursor.skipSpaces();

        const row: OverlayRow = {overlay, placing, from};

        if ( cursor.beforeWord("for") ) {
            cursor.readWord("for");
            row.for = cursor.parse(Expression).operand();
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            keyword("overlay"), "(", _,
            this.row.overlay, _,

            keyword("placing"), _,
            this.row.placing, _,

            keyword("from"), _,
            this.row.from, _
        ];

        if ( this.row.for ) {
            output.push(
                keyword("for"), _,
                this.row.for, _
            );
        }

        output.push(")");
        return output;
    }
}