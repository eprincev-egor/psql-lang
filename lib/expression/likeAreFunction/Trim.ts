import {
    AbstractNode, Cursor,
    TemplateElement, keyword
} from "abstract-lang";
import { Expression, Operand } from "../Expression";
import { likeAreFunction } from "./likeAreFunction";

export type TrimType = "both" | "leading" | "trailing";
export interface TrimRow {
    trim: TrimType;
    characters?: Operand;
    from: Operand;
}

export class Trim extends AbstractNode<TrimRow> {

    static parseContent(cursor: Cursor): TrimRow {
        let type: TrimType = "both";
        if ( cursor.beforeWord("both") ) {
            cursor.readWord("both");
        }
        else if ( cursor.beforeWord("leading") ) {
            cursor.readWord("leading");
            type = "leading";
        }
        else if ( cursor.beforeWord("trailing") ) {
            cursor.readWord("trailing");
            type = "trailing";
        }

        let from!: Operand;
        let characters: Operand | undefined;
        if ( cursor.beforeWord("from") ) {
            cursor.readWord("from");
            from = cursor.parse(Expression).operand();
        }
        else {
            from = cursor.parse(Expression).operand();

            if ( cursor.beforeWord("from") ) {
                characters = from;
                cursor.readWord("from");
                from = cursor.parse(Expression).operand();
            }
        }

        cursor.skipSpaces();
        if ( cursor.beforeValue(",") ) {
            cursor.readValue(",");
            cursor.skipSpaces();

            characters = cursor.parse(Expression).operand();
        }

        const row: TrimRow = {
            trim: type,
            from
        };
        if ( characters ) {
            row.characters = characters;
        }
        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            keyword("trim"), "("
        ];
        if ( this.row.trim !== "both" ) {
            output.push(keyword(this.row.trim));
        }

        if ( this.row.characters ) {
            output.push(
                this.row.characters,
                keyword("from"),
                this.row.from
            );
        }
        else {
            output.push( this.row.from );
        }

        output.push( ")" );
        return output;
    }
}

likeAreFunction.trim = Trim;