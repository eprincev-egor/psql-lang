import {
    AbstractNode, Cursor,
    TemplateElement
} from "abstract-lang";
import { Operand } from "../Operand";

const IS_XXX = ["true", "false", "null"];

const ENTRY_PHRASES: string[][] = [];
const NORMALIZE_MAP: {[key: string]: string} = {};

for (const XXX of IS_XXX) {
    ENTRY_PHRASES.push(["is", XXX]);
    ENTRY_PHRASES.push(["is", "not", XXX]);
    ENTRY_PHRASES.push([`is${XXX}`]);
    ENTRY_PHRASES.push([`not${XXX}`]);

    NORMALIZE_MAP[`is ${XXX}`] = `is ${XXX}`;
    NORMALIZE_MAP[`is${XXX}`] = `is ${XXX}`;
    NORMALIZE_MAP[`is not ${XXX}`] = `is not ${XXX}`;
    NORMALIZE_MAP[`not${XXX}`] = `is not ${XXX}`;
}

export interface PostUnaryOperatorRow {
    operand: Operand;
    postOperator: string;
}

export class PostUnaryOperator extends AbstractNode<PostUnaryOperatorRow> {

    static entryOperator(cursor: Cursor): boolean {
        for (const entryPhrase of ENTRY_PHRASES) {
            if ( cursor.beforePhrase(...entryPhrase) ) {
                return true;
            }
        }
        return false;
    }

    static parseOperator(cursor: Cursor): string {
        for (const entryPhrase of ENTRY_PHRASES) {
            if ( cursor.beforePhrase(...entryPhrase) ) {
                const inputPhrase = cursor.readPhrase(...entryPhrase)
                    .join(" ").toLowerCase();
                const normalPhrase = NORMALIZE_MAP[ inputPhrase ];
                return normalPhrase;
            }
        }

        const oneOf = ENTRY_PHRASES.map((phrase) =>
            phrase.join(" ")
        ).join("");
        cursor.throwError(`expected one of:\n${oneOf}`);
    }

    template(): TemplateElement[] {
        return [this.row.operand, " ", this.row.postOperator];
    }
}