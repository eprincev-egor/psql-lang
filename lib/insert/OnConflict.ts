import { AbstractScopeNode, Cursor, TemplateElement, _, eol, keyword, printChain, tab } from "abstract-lang";
import { ColumnReference, Expression, Operand, SubExpression } from "../expression";
import { Name } from "../base";
import { SetItem } from "../update";

export interface OnConflictRow {
    constraint?: Name | Operand[];
    where?: Operand;
    do: "nothing" | {
        update: {
            set: SetItem[];
            where?: Operand;
        };
    };
}

export class OnConflict extends AbstractScopeNode<OnConflictRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforePhrase("on", "conflict");
    }

    static parse(cursor: Cursor): OnConflictRow {
        cursor.readPhrase("on", "conflict");

        const constraint = this.parseConstraint(cursor);

        const where = this.parseWhere(cursor);

        const action = this.parseDo(cursor);

        return {
            constraint,
            where,
            do: action
        };
    }

    private static parseConstraint(cursor: Cursor) {
        if ( cursor.beforeWord("on") ) {
            cursor.readPhrase("on", "constraint");
            const constraint = cursor.parse(Name);

            cursor.skipSpaces();
            return constraint;
        }

        if ( !cursor.beforeValue("(") ) return;
        cursor.readValue("(");
        cursor.skipSpaces();

        const constraint = cursor.parseChainOf(Expression, ",")
            .map((expression) => expression.operand());

        for (const item of constraint) {
            if ( item instanceof ColumnReference ) continue;
            if ( item instanceof SubExpression ) continue;

            cursor.throwError("expected brackets for expressions", item);
        }

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        return constraint;
    }

    private static parseDo(cursor: Cursor): OnConflictRow["do"] {
        cursor.readWord("do");

        if ( cursor.beforeWord("nothing") ) {
            cursor.readWord("nothing");
            return "nothing";
        }

        cursor.readPhrase("update", "set");
        const set = cursor.parseChainOf(SetItem, ",");
        const where = this.parseWhere(cursor);

        return {update: {set, where}};
    }

    private static parseWhere(cursor: Cursor) {
        if ( !cursor.beforeWord("where") ) return;

        cursor.readWord("where");
        const where = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        return where;
    }

    template(): TemplateElement[] {
        const onConflict = this.row;
        const output: TemplateElement[] = [];

        output.push(keyword("on"), keyword("conflict"));

        if ( onConflict.constraint instanceof Name ) {
            output.push(
                keyword("on"),
                keyword("constraint"),
                onConflict.constraint
            );
        }
        else if ( Array.isArray(onConflict.constraint) ) {
            output.push(_, "(");
            output.push(...printChain(onConflict.constraint, ","));
            output.push(")");
        }

        if ( onConflict.where ) {
            output.push(eol, keyword("where"), eol);
            output.push(tab, onConflict.where, eol);
        }

        output.push(eol, keyword("do"));

        if ( onConflict.do === "nothing" ) {
            output.push(keyword("nothing"));
        }
        else {
            output.push(keyword("update"), keyword("set"), eol);
            output.push(
                tab, ...printChain(onConflict.do.update.set, ",", eol, tab)
            );

            if ( onConflict.do.update.where ) {
                output.push(eol, keyword("where"), eol);
                output.push(tab, onConflict.do.update.where);
            }
        }

        return output;
    }

    // eslint-disable-next-line class-methods-use-this
    hasClojure(): boolean {
        return true;
    }
}