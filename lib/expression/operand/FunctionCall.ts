import {
    AbstractNode, Cursor,
    TemplateElement, printChain, keyword, _, eol, tab
} from "abstract-lang";
import { FunctionReference } from "./FunctionReference";
import { Expression, Operand } from "../Expression";
import { ColumnReference } from "./ColumnReference";
import { OrderByItem } from "../../select/OrderByItem";

export interface FunctionCallRow {
    form?: "all" | "distinct";
    call: FunctionReference;
    arguments: Operand[];
    filter?: Operand;
    orderBy?: OrderByItem[];
    within?: OrderByItem[];
}

export class FunctionCall extends AbstractNode<FunctionCallRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.before(FunctionReference);
    }

    static parse(cursor: Cursor): FunctionCallRow {
        const columnReference = cursor.parse(ColumnReference);
        const functionName = FunctionReference.fromColumn(cursor, columnReference);
        return this.parseAfterName(cursor, functionName);
    }

    static parseAfterName(
        cursor: Cursor,
        functionName: FunctionReference
    ): FunctionCallRow {
        const row: FunctionCallRow = {
            call: functionName,
            arguments: []
        };
        cursor.readValue("(");
        cursor.skipSpaces();

        if ( cursor.beforeWord("all") ) {
            cursor.readWord("all");
            row.form = "all";
        }
        else if ( cursor.beforeWord("distinct") ) {
            cursor.readWord("distinct");
            row.form = "distinct";
        }

        if ( !cursor.beforeValue(")") ) {
            row.arguments = cursor.parseChainOf(Expression, ",")
                .map((expr) => expr.operand());
        }

        cursor.skipSpaces();
        if ( cursor.beforeWord("order") ) {
            cursor.readPhrase("order", "by");
            row.orderBy = cursor.parseChainOf(OrderByItem, ",");
        }

        cursor.readValue(")");
        cursor.skipSpaces();

        if ( cursor.beforeWord("within") ) {
            if ( row.orderBy ) {
                cursor.throwError("cannot use multiple ORDER BY clauses with WITHIN GROUP");
            }

            cursor.readPhrase("within", "group", "(", "order", "by");
            row.within = cursor.parseChainOf(OrderByItem, ",");
            cursor.readValue(")");
        }

        if ( cursor.beforeWord("filter") ) {
            cursor.readWord("filter");
            cursor.readValue("(");
            cursor.skipSpaces();
            cursor.readWord("where");

            row.filter = cursor.parse(Expression).operand();

            cursor.skipSpaces();
            cursor.readValue(")");
            cursor.skipSpaces();
        }

        return row;
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [
            this.row.call, "("
        ];

        // all | distinct
        if ( this.row.form ) {
            output.push( _, keyword(this.row.form) );

            if ( !this.row.orderBy ) {
                output.push(_);
            }
        }

        if ( this.row.orderBy ) {
            output.push(eol, tab);
        }

        output.push(
            ...printChain(this.row.arguments, ",", _)
        );

        if ( this.row.form && !this.row.orderBy ) {
            output.push( _ );
        }

        if ( this.row.orderBy ) {
            output.push(
                eol,
                tab, keyword("order"), keyword("by"),
                ...printChain(this.row.orderBy, ",", _),
                eol
            );
        }

        output.push(")");

        if ( this.row.within ) {
            output.push(
                eol,
                keyword("within"), keyword("group"), _, "(", eol,
                tab, keyword("order"), keyword("by"),
                ...printChain(this.row.within, ",", _), eol,
                ")"
            );
        }

        if ( this.row.filter ) {
            output.push(
                eol,
                keyword("filter"), _, "(", eol,
                tab, keyword("where"), eol,
                tab, tab, this.row.filter, eol,
                ")"
            );
        }

        return output;
    }
}