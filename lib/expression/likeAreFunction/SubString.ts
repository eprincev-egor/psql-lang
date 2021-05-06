import {
    AbstractNode, Cursor,
    keyword,
    TemplateElement
} from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { likeAreFunction } from "./likeAreFunction";

export interface SubStringRow {
    subString: Operand;
    from: Operand;
    for?: Operand;
}

export class SubString extends AbstractNode<SubStringRow> {

    static parseContent(cursor: Cursor): SubStringRow {
        const row: SubStringRow = {
            subString: cursor.parse(Expression).operand(),
            from: this.parseFrom(cursor)
        };

        if ( cursor.beforeWord("for") ) {
            cursor.readWord("for");

            row.for = cursor.parse(Expression).operand();
        }
        else if ( cursor.beforeValue(",") ) {
            cursor.readValue(",");
            cursor.skipSpaces();

            row.for = cursor.parse(Expression).operand();
        }

        return row;
    }

    static parseFrom(cursor: Cursor): Operand {

        if ( cursor.beforeWord("from") ) {
            cursor.readWord("from");

            return cursor.parse(Expression).operand();
        }
        else if ( cursor.beforeValue(",") ) {
            cursor.readValue(",");
            cursor.skipSpaces();

            return cursor.parse(Expression).operand();
        }

        cursor.throwError("required 'from' position");
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            keyword("substring"), "(",
            this.row.subString
        ];

        output.push(
            keyword("from"), this.row.from
        );

        if ( this.row.for ) {
            output.push(
                keyword("for"), this.row.for
            );
        }

        output.push(")");

        return output;
    }
}

likeAreFunction.substring = SubString;