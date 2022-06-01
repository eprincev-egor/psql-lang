import {
    AbstractNode, Cursor,
    TemplateElement,
    keyword, eol, tab, _
} from "abstract-lang";
import { ColumnReference, Expression, Operand } from "../expression";
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

export type JoinRow = {
    type: JoinType;
    from: FromItemType;
    on: Operand;
} | {
    type: JoinType;
    from: FromItemType;
    using: ColumnReference[];
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

        if ( cursor.beforeWord("using") ) {
            cursor.readWord("using");
            cursor.readValue("(");
            cursor.skipSpaces();

            const using = cursor.parseChainOf(ColumnReference);

            cursor.skipSpaces();
            cursor.readValue(")");

            return {type, from, using};
        }

        cursor.readWord("on");
        const on = cursor.parse(Expression).operand();

        return {type, from, on};
    }

    private static parseType(cursor: Cursor) {
        let type: JoinType = "join";

        if ( cursor.beforeWord("left") ) {
            cursor.readWord("left");
            type = "left join";

            if ( cursor.beforeWord("outer") ) {
                cursor.readWord("outer");
                type = "left outer join";
            }
        }
        else if ( cursor.beforeWord("inner") ) {
            cursor.readWord("inner");
            type = "inner join";
        }
        else if ( cursor.beforeWord("right") ) {
            cursor.readWord("right");
            type = "right join";

            if ( cursor.beforeWord("outer") ) {
                cursor.readWord("outer");
                type = "right outer join";
            }
        }
        else if ( cursor.beforeWord("full") ) {
            cursor.readWord("full");
            type = "full join";

            if ( cursor.beforeWord("outer") ) {
                cursor.readWord("outer");
                type = "full outer join";
            }
        }
        else if ( cursor.beforeWord("cross") ) {
            cursor.readWord("cross");
            type = "cross join";
        }

        cursor.readWord("join");
        return type;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            ...this.printType(),
            this.row.from
        ];

        if ( "using" in this.row ) {
            output.push(
                keyword("using"), _, "(", ...this.row.using, ")"
            );
        }
        else {
            output.push(
                keyword("on"), eol,
                tab, this.row.on
            );
        }

        return output;
    }

    private printType() {
        return this.row.type.split(" ")
            .map((word) => keyword(word));
    }
}