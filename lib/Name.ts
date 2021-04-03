import { AbstractNode, Cursor, DigitsToken, WordToken } from "abstract-lang";

export interface NameRow {
    name: string;
}

export class Name extends AbstractNode<NameRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(WordToken);
    }

    static parse(cursor: Cursor): NameRow {

        let name = "";
        while ( !cursor.beforeEnd() ) {
            if ( cursor.beforeToken(WordToken) ) {
                name += cursor.read(WordToken).value;
            }
            else if ( cursor.beforeToken(DigitsToken) ) {
                name += cursor.read(DigitsToken).value;
            }
            else {
                break;
            }
        }

        if ( /^\d/.test(name) ) {
            cursor.throwError(`name should starts with alphabet char, invalid name: ${name}`);
        }

        return {name: name.toLowerCase()};
    }

    template(): string {
        return this.row.name;
    }
}