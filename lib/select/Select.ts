import {
    AbstractNode, Cursor,
    TemplateElement,
    _, eol, tab, keyword, printChain
} from "abstract-lang";
import { Expression, Operand } from "../expression";
import { SelectColumn } from "./SelectColumn";
import { OrderByItem } from "./OrderByItem";
import { FromItemType, parseFromItem } from "./FromItem";
import { With } from "./With";
import { Fetch } from "./Fetch";
import { GroupByElement } from "./GroupByElement";

export interface SelectRow {
    distinct?: SelectDistinctType;
    with?: With;
    select: SelectColumn[];
    from: FromItemType[];
    where?: Operand;
    groupBy?: GroupByElement[];
    having?: Operand;
    orderBy?: OrderByItem[];
    offset?: Operand;
    limit?: Operand;
    fetch?: Fetch;
    union?: SelectUnion;
}

export type SelectDistinctType = {all: true} | {on: Operand[]};
export interface SelectUnion {
    type: SelectUnionType;
    option?: SelectUnionOption;
    select: Select;
}
export type SelectUnionType = "union" | "intersect" | "except";
export type SelectUnionOption = "all" | "distinct";

export class Select extends AbstractNode<SelectRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeWord("select") ||
            cursor.before(With)
        );
    }

    static parse(cursor: Cursor): SelectRow {
        const selectRow: SelectRow = {
            select: [],
            from: []
        };

        if ( cursor.before(With) ) {
            selectRow.with = cursor.parse(With);
        }

        cursor.readWord("select");

        if ( cursor.beforeWord("distinct") ) {
            this.parseDistinct(cursor, selectRow);
        }

        const beforeColumns = (
            !cursor.beforeWord("from") &&
            !cursor.beforeWord("where") &&
            cursor.before(Expression)
        );
        if ( beforeColumns ) {
            selectRow.select = cursor.parseChainOf(SelectColumn, ",");
        }

        if ( cursor.beforeWord("from") ) {
            selectRow.from = this.parseFrom(cursor);
        }

        if ( cursor.beforeWord("where") ) {
            cursor.readWord("where");
            selectRow.where = cursor.parse(Expression).operand();
        }

        if ( cursor.beforeWord("group") ) {
            cursor.readPhrase("group", "by");
            selectRow.groupBy = cursor.parseChainOf(GroupByElement, ",");
        }

        if ( cursor.beforeWord("having") ) {
            cursor.readWord("having");
            selectRow.having = cursor.parse(Expression).operand();
        }

        if ( cursor.beforeWord("order") ) {
            cursor.readPhrase("order", "by");
            selectRow.orderBy = cursor.parseChainOf(OrderByItem, ",");
        }

        this.parseOffsetLimit(cursor, selectRow);

        if (
            cursor.beforeWord("union") ||
            cursor.beforeWord("intersect") ||
            cursor.beforeWord("except")
        ) {
            this.parseUnion(cursor, selectRow);
        }

        return selectRow;
    }

    private static parseDistinct(cursor: Cursor, selectRow: SelectRow) {
        cursor.readWord("distinct");

        if ( cursor.beforeWord("on") ) {
            cursor.readWord("on");

            cursor.readValue("(");
            cursor.skipSpaces();

            selectRow.distinct = {
                on: cursor.parseChainOf(Expression, ",")
                    .map((expr) => expr.operand())
            };

            cursor.skipSpaces();
            cursor.readValue(")");
        }
        else {
            selectRow.distinct = {all: true};
        }

        cursor.skipSpaces();
    }

    private static parseFrom(cursor: Cursor) {
        cursor.readWord("from");

        const fromItems: FromItemType[] = [];

        do {
            const fromItem = parseFromItem(cursor);
            fromItems.push(fromItem);

            cursor.skipSpaces();

            if ( !cursor.beforeValue(",") ) {
                break;
            }
            cursor.readValue(",");
            cursor.skipSpaces();

        } while ( !cursor.beforeEnd() );

        return fromItems;
    }

    private static parseOffsetLimit(cursor: Cursor, selectRow: SelectRow) {
        while ( !cursor.beforeEnd() ) {
            if ( cursor.beforeWord("offset") ) {
                this.parseOffset(cursor, selectRow);
            }
            else if ( cursor.beforeWord("limit") ) {
                this.parseLimit(cursor, selectRow);
            }
            else if ( cursor.before(Fetch) ) {
                if ( selectRow.limit ) {
                    cursor.throwError("unexpected fetch, limit already exists");
                }

                selectRow.fetch = cursor.parse(Fetch);
            }
            else {
                break;
            }
        }
    }

    private static parseOffset(cursor: Cursor, selectRow: SelectRow) {
        if ( selectRow.offset ) {
            cursor.throwError("duplicated offset");
        }

        cursor.readWord("offset");
        selectRow.offset = cursor.parse(Expression).operand();

        cursor.skipSpaces();
    }

    private static parseLimit(cursor: Cursor, selectRow: SelectRow) {
        if ( selectRow.limit ) {
            cursor.throwError("duplicated limit");
        }
        if ( selectRow.fetch ) {
            cursor.throwError("unexpected limit, fetch already exists");
        }

        cursor.readWord("limit");

        if ( cursor.beforeWord("all") ) {
            cursor.readWord("all");
        }
        else {
            selectRow.limit = cursor.parse(Expression).operand();
        }

        cursor.skipSpaces();
    }

    private static parseUnion(cursor: Cursor, selectRow: SelectRow) {
        let type: SelectUnionType = "union";

        if ( cursor.beforeWord("intersect") ) {
            cursor.readWord("intersect");
            type = "intersect";
        }
        else if ( cursor.beforeWord("except") ) {
            cursor.readWord("except");
            type = "except";
        }
        else {
            cursor.readWord("union");
        }

        let option: SelectUnionOption | undefined;
        if ( cursor.beforeWord("all") ) {
            cursor.readWord("all");
            option = "all";
        }
        else if ( cursor.beforeWord("distinct") ) {
            cursor.readWord("distinct");
            option = "distinct";
        }

        selectRow.union = {
            type,
            select: cursor.parse(Select)
        };
        if ( option ) {
            selectRow.union.option = option;
        }
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];

        if ( this.row.with ) {
            output.push( this.row.with, eol );
        }

        output.push( keyword("select") );

        this.printDistinct(output);
        this.printSelectColumns(output);
        this.printFrom(output);
        this.printWhere(output);
        this.printGroupBy(output);
        this.printHaving(output);
        this.printOrderBy(output);
        this.printFetch(output);
        this.printUnion(output);

        return output;
    }

    private printDistinct(output: TemplateElement[]) {
        if ( this.row.distinct ) {
            output.push( keyword("distinct") );

            if ( "on" in this.row.distinct ) {
                output.push( keyword("on"), _, "(" );
                output.push(
                    ...printChain( this.row.distinct.on, ",", _ )
                );
                output.push( ")" );
            }
        }
    }

    private printSelectColumns(output: TemplateElement[]) {
        if ( this.row.select.length > 0 ) {
            output.push(eol, tab);
            output.push(
                ...printChain(this.row.select, ",", eol, tab)
            );
        }
    }

    private printFrom(output: TemplateElement[]) {
        if ( this.row.from.length > 0 ) {
            output.push(eol, keyword("from"), _);
            output.push(...printChain(this.row.from, ",", _));
        }

    }

    private printWhere(output: TemplateElement[]) {
        if ( this.row.where ) {
            output.push(
                eol,
                keyword("where"), eol,
                tab, this.row.where
            );
        }
    }

    private printGroupBy(output: TemplateElement[]) {
        if ( this.row.groupBy ) {
            output.push(
                eol,
                keyword("group"), keyword("by"), eol,
                tab, ...printChain(this.row.groupBy, ",", eol, tab)
            );
        }
    }

    private printHaving(output: TemplateElement[]) {
        if ( this.row.having ) {
            output.push(
                eol,
                keyword("having"), eol,
                tab, this.row.having
            );
        }
    }

    private printOrderBy(output: TemplateElement[]) {
        if ( this.row.orderBy ) {
            output.push(
                eol,
                keyword("order"), keyword("by")
            );
            output.push(
                ...printChain(this.row.orderBy, ",")
            );
        }
    }

    private printFetch(output: TemplateElement[]) {
        if ( this.row.offset ) {
            output.push(
                eol, keyword("offset"),
                this.row.offset
            );
        }

        if ( this.row.limit ) {
            output.push(
                eol, keyword("limit"),
                this.row.limit
            );
        }

        if ( this.row.fetch ) {
            output.push(
                eol, this.row.fetch
            );
        }
    }

    private printUnion(output: TemplateElement[]) {
        if ( this.row.union ) {
            output.push( eol, keyword(this.row.union.type) );

            if ( this.row.union.option ) {
                output.push(
                    keyword(this.row.union.option)
                );
            }

            output.push( eol, this.row.union.select );
        }
    }
}