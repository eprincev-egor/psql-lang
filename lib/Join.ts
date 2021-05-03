import {
    AbstractNode, Cursor,
    TemplateElement,
    keyword, eol, tab
} from "abstract-lang";
import { Expression, Operand } from "./Expression";
import { FromItemType, parseFromItem } from "./FromItem";

export type JoinType = (
    "join" |
    "inner join" |
    "left join" |
    "left outer join" |
    "right join" |
    "right outer join" |
    "full join" |
    "full outer join" |
    "cross join" |
    "natural join"
);

export interface JoinRow {
    type: JoinType;
    from: FromItemType;
    on: Operand;
}

export class Join extends AbstractNode<JoinRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("left") ||
            cursor.beforeWord("right") ||
            cursor.beforeWord("inner") ||
            cursor.beforeWord("join") ||
            cursor.beforeWord("full") ||
            cursor.beforeWord("cross")
        );
    }

    static parse(cursor: Cursor): JoinRow {
        const type = this.parseType(cursor);
        const from = parseFromItem(cursor);

        cursor.readWord("on");
        const on = cursor.parse(Expression).operand();

        return {type,from, on};
    }

    private static parseType(cursor: Cursor) {
        let type: JoinType = "join";

        if ( cursor.beforeWord("left") ) {
            cursor.readWord("left");
            type = "left join";
        }
        else if ( cursor.beforeWord("inner") ) {
            cursor.readWord("inner");
            type = "inner join";
        }
        else if ( cursor.beforeWord("right") ) {
            cursor.readWord("right");
            type = "right join";
        }
        else if ( cursor.beforeWord("full") ) {
            cursor.readWord("full");
            type = "full join";
        }
        else if ( cursor.beforeWord("cross") ) {
            cursor.readWord("cross");
            type = "cross join";
        }

        cursor.readWord("join");
        return type;
    }

    template(): TemplateElement[] {
        return [
            ...this.printType(),
            this.row.from,
            keyword("on"), eol,
            tab, this.row.on
        ];
    }

    private printType() {
        return this.row.type.split(" ")
            .map((word) => keyword(word));
    }
}