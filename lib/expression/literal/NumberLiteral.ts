import {
    AbstractNode,
    Cursor,
    DigitsToken,
    OperatorsToken,
    WordToken
} from "abstract-lang";

export interface NumberRow {
    number: string;
}

export class NumberLiteral extends AbstractNode<NumberRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforeToken(DigitsToken) ||
            cursor.beforeSequence(".", DigitsToken) ||
            cursor.beforeSequence("-", DigitsToken) ||
            cursor.beforeSequence("-", ".", DigitsToken)
        );
    }

    static parse(cursor: Cursor): NumberRow {
        let numb = "";
        if ( cursor.beforeValue("-") ) {
            numb += cursor.readValue("-");
        }

        if ( cursor.beforeToken(DigitsToken) ) {
            numb += cursor.read(DigitsToken).value;
        }

        if ( cursor.beforeValue(".") ) {
            numb += cursor.readValue(".");
            numb += cursor.read(DigitsToken).value;
        }

        if ( cursor.beforeValue("e") || cursor.beforeValue("E") ) {
            numb += "e";
            cursor.skipOne(WordToken);

            if ( cursor.beforeValue("+") || cursor.beforeValue("-") ) {
                numb += cursor.read(OperatorsToken).value;
            }

            numb += cursor.read(DigitsToken).value;
        }

        return {number: numb};
    }

    template(): string {
        return this.row.number;
    }
}