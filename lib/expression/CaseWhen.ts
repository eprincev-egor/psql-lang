import {
    AbstractNode, Cursor,
    TemplateElement, printTabChain,
    eol, tab, _, keyword
} from "abstract-lang";
import { CaseWhenElement } from "./CaseWhenElement";
import { Expression, Operand } from "./Expression";

export interface CaseWhenRow {
    switch?: Operand;
    case: CaseWhenElement[];
    else?: Operand;
}

export class CaseWhen extends AbstractNode<CaseWhenRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeWord("case");
    }

    static parse(cursor: Cursor): CaseWhenRow {
        cursor.readWord("case");

        let switchExpression: Operand | undefined;
        if ( !cursor.before(CaseWhenElement) ) {
            switchExpression = cursor.parse(Expression).operand();
        }

        const caseElements = cursor.parseChainOf(CaseWhenElement);

        let elseExpression: Operand | undefined;
        if ( cursor.beforeWord("else") ) {
            cursor.readWord("else");
            elseExpression = cursor.parse(Expression).operand();
        }

        cursor.readWord("end");


        const row: CaseWhenRow = {
            case: caseElements
        };
        if ( switchExpression ) {
            row.switch = switchExpression;
        }
        if ( elseExpression ) {
            row.else = elseExpression;
        }
        return row;
    }

    template(): TemplateElement[] {
        return [
            keyword("case"), ...this.printSwitch(), eol,
            ...printTabChain(this.row.case, eol), eol,
            ...this.printElse(),
            keyword("end")
        ];
    }

    private printSwitch() {
        return this.row.switch ? [this.row.switch] : [];
    }

    private printElse() {
        if ( !this.row.else ) {
            return [];
        }

        return [tab, keyword("else"), _, this.row.else, eol];
    }
}