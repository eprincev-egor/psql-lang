import {
    AbstractDeclarationNode, Cursor,
    TemplateElement, keyword, printChain, eol, _
} from "abstract-lang";
import { Join } from "./Join";
import { Name } from "../base";
import { keywords } from "./keywords";

export interface FromItemRow {
    joins?: Join[];
    as?: Name;
    columnAliases?: Name[];
}

export abstract class AbstractFromItem<TRow extends FromItemRow>
    extends AbstractDeclarationNode<TRow> {

    protected static parseOther(cursor: Cursor): FromItemRow {
        const row: FromItemRow = {};

        if ( cursor.beforeWord("as") ) {
            cursor.readWord("as");
            row.as = cursor.parse(Name);
        }
        else if ( cursor.before(Name) ) {
            const word = cursor.nextToken.value.toLowerCase();

            if ( !keywords.includes(word) ) {
                row.as = cursor.parse(Name);
            }
        }

        cursor.skipSpaces();
        if ( row.hasOwnProperty("as") && row.as && cursor.beforeValue("(") ) {
            cursor.readValue("(");
            cursor.skipSpaces();

            row.columnAliases = cursor.parseChainOf(Name, ",");

            cursor.skipSpaces();
            cursor.readValue(")");
            cursor.skipSpaces();
        }

        if ( cursor.before(Join) ) {
            row.joins = cursor.parseChainOf(Join);
        }

        return row;
    }

    protected printOther(output: TemplateElement[]): void {
        const alias = this.row.as;
        if ( alias instanceof Name ) {
            output.push( keyword("as"), alias );

            if ( this.row.columnAliases ) {
                output.push("(");
                output.push(...printChain(this.row.columnAliases, ",", _));
                output.push(")");
            }
        }

        if ( this.row.joins ) {
            output.push(eol, eol);
            output.push(...printChain(this.row.joins, eol, eol));
        }
    }

    getFromItems(): AbstractFromItem<FromItemRow>[] {
        const joins = (
            this.row.joins ?
                this.row.joins : []
        ) as Join[];

        const fromItems: AbstractFromItem<FromItemRow>[] = [];
        for (const join of joins) {
            fromItems.push( join.row.from );
            fromItems.push( ...join.row.from.getFromItems() );
        }

        return fromItems;
    }
}