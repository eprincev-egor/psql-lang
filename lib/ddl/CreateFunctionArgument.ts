import {
    AbstractNode, Cursor,
    TemplateElement,
    WordToken,
    keyword
} from "abstract-lang";
import { Name } from "../base";
import { Expression, Operand, PgType } from "../expression";

export interface CreateFunctionArgumentRow {
    in?: boolean;
    out?: boolean;
    name?: Name;
    type: PgType;
    default?: Operand;
}

export class CreateFunctionArgument extends AbstractNode<CreateFunctionArgumentRow> {

    static entry(cursor: Cursor): boolean {
        return cursor.beforeToken(WordToken);
    }

    static parse(cursor: Cursor): CreateFunctionArgumentRow {
        const options: Partial<CreateFunctionArgumentRow> = {};

        if ( cursor.beforeWord("out") ) {
            cursor.readWord("out");
            options.out = true;
        }
        else if ( cursor.beforeWord("in") ) {
            cursor.readWord("in");
            options.in = true;
        }

        const beforeType = cursor.nextToken;

        let name: Name | undefined;
        let type = cursor.parse(PgType);

        if ( cursor.before(Name) ) {
            cursor.setPositionBefore(beforeType);

            name = cursor.parse(Name);
            cursor.skipSpaces();

            type = cursor.parse(PgType);
            cursor.skipSpaces();
        }

        if ( cursor.beforeWord("default") ) {
            cursor.readWord("default");
            options.default = cursor.parse(Expression).operand();
        }

        return {
            ...options,
            name, type
        };
    }

    template(): TemplateElement[] {
        const output: TemplateElement[] = [];
        const argument = this.row;

        if ( argument.in ) {
            output.push(keyword("in"));
        }
        else if ( argument.out ) {
            output.push(keyword("out"));
        }

        if ( argument.name ) {
            output.push(argument.name, " ");
        }
        output.push(argument.type);

        if ( argument.default ) {
            output.push(keyword("default"), argument.default);
        }

        return output;
    }
}