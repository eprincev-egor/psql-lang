import { AbstractNode, Cursor } from "abstract-lang";
import { Join } from "./Join";
import { Name } from "../base";
import { keywords } from "./keywords";

export interface FromItemRow {
    joins?: Join[];
    as?: Name;
}

export abstract class AbstractFromItem<TRow extends FromItemRow>
    extends AbstractNode<TRow> {

    protected static parseAlias(cursor: Cursor): Name | undefined {
        if ( cursor.beforeWord("as") ) {
            cursor.readWord("as");
            return cursor.parse(Name);
        }
        else if ( cursor.before(Name) ) {
            const word = cursor.nextToken.value.toLowerCase();

            if ( !keywords.includes(word) ) {
                return cursor.parse(Name);
            }
        }
    }
}