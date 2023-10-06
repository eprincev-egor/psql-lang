import {
    AbstractNode, Cursor,
    TemplateElement,
    eol, keyword, printChain, tab, _
} from "abstract-lang";
import { Name, SchemaName } from "../base";
import { Expression, Operand, StringLiteral } from "../expression";
import { CreateFunctionArgument } from "./CreateFunctionArgument";
import { CreateFunctionReturns } from "./CreateFunctionReturns";

export interface CreateFunctionRow {
    schema?: Name;
    name: Name;
    args: CreateFunctionArgument[];
    returns: CreateFunctionReturns;
    body: StringLiteral;
    language: "plpgsql" | "sql";
    immutability?: "immutable" | "stable" | "volatile";
    parallel?: "unsafe" | "restricted" | "safe";
    cost?: Operand;
    inputNullsRule?: "called on null input" | "returns null on null input" | "strict";
}

export class CreateFunction extends AbstractNode<CreateFunctionRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("function") ||
            cursor.beforePhrase("create", "function") ||
            cursor.beforePhrase("create", "or", "replace", "function") ||
            cursor.beforePhrase("procedure") ||
            cursor.beforePhrase("create", "procedure") ||
            cursor.beforePhrase("create", "or", "replace", "procedure")
        );
    }

    static parse(cursor: Cursor): CreateFunctionRow {
        const options: Partial<CreateFunctionRow> = {};

        this.parseEntry(cursor);

        const {schema, name} = cursor.parse(SchemaName).row;
        cursor.skipSpaces();

        if ( schema ) {
            options.schema = schema;
        }


        const args = this.parseArguments(cursor);

        const returns = cursor.parse(CreateFunctionReturns);
        cursor.skipSpaces();

        this.parseOptions(cursor, options);

        cursor.readWord("as");
        const body = cursor.parse(StringLiteral);
        cursor.skipSpaces();

        this.parseOptions(cursor, options);

        const language = options.language;
        if ( !language ) {
            cursor.throwError("expected function language");
        }

        this.validateParams(cursor, args, returns);

        return {
            name, args,
            body, returns,
            ...options,
            language
        };
    }

    private static parseEntry(cursor: Cursor) {
        if ( cursor.beforeWord("create") ) {
            cursor.readWord("create");

            if ( cursor.beforeWord("or") ) {
                cursor.readPhrase("or", "replace");
            }
        }

        if ( cursor.beforeWord("procedure") ) {
            cursor.readWord("procedure");
        }
        else {
            cursor.readWord("function");
        }

        cursor.skipSpaces();
    }

    private static parseArguments(cursor: Cursor): CreateFunctionArgument[] {
        let args: CreateFunctionArgument[] = [];

        cursor.readValue("(");
        cursor.skipSpaces();

        if ( cursor.before(Name) ) {
            args = cursor.parseChainOf(CreateFunctionArgument, ",");
        }

        cursor.skipSpaces();
        cursor.readValue(")");
        cursor.skipSpaces();

        return args;
    }

    private static parseOptions(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        this.parseLanguage(cursor, options);
        this.parseImmutability(cursor, options);
        this.parseInputNullsRule(cursor, options);
        this.parseParallel(cursor, options);
        this.parseCost(cursor, options);
    }

    private static parseLanguage(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        if ( !cursor.beforeWord("language") ) {
            return;
        }

        cursor.readWord("language");

        if ( cursor.beforeWord("sql") ) {
            cursor.readWord("sql");
            options.language = "sql";
        }
        else if ( cursor.beforeWord("plpgsql") ) {
            cursor.readWord("plpgsql");
            options.language = "plpgsql";
        }
        else {
            cursor.throwError("expected language plpgsql or sql");
        }
    }

    private static parseImmutability(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        if ( cursor.beforeWord("immutable") ) {
            cursor.readWord("immutable");
            options.immutability = "immutable";
        }
        else if ( cursor.beforeWord("stable") ) {
            cursor.readWord("stable");
            options.immutability = "stable";
        }
        else if ( cursor.beforeWord("volatile") ) {
            cursor.readWord("volatile");
            options.immutability = "volatile";
        }
    }

    private static parseParallel(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        if ( !cursor.beforeWord("parallel") ) {
            return;
        }

        cursor.readWord("parallel");

        if ( cursor.beforeWord("unsafe") ) {
            cursor.readWord("unsafe");
            options.parallel = "unsafe";
        }
        else if ( cursor.beforeWord("safe") ) {
            cursor.readWord("safe");
            options.parallel = "safe";
        }
        else if ( cursor.beforeWord("restricted") ) {
            cursor.readWord("restricted");
            options.parallel = "restricted";
        }
        else {
            cursor.throwError("expected parallel type");
        }
    }

    private static parseCost(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        if ( cursor.beforeWord("cost") ) {
            cursor.readWord("cost");
            options.cost = cursor.parse(Expression).operand();
        }
    }

    private static parseInputNullsRule(
        cursor: Cursor,
        options: Partial<CreateFunctionRow>
    ) {
        if ( cursor.beforeWord("strict") ) {
            cursor.readWord("strict");
            options.inputNullsRule = "strict";
        }
        else if ( cursor.beforeWord("called") ) {
            cursor.readPhrase("called", "on", "null", "input");
            options.inputNullsRule = "called on null input";
        }
        else if ( cursor.beforePhrase("returns", "null", "on", "null", "input")) {
            cursor.readPhrase("returns", "null", "on", "null", "input");
            options.inputNullsRule = "returns null on null input";
        }
    }

    private static validateParams(
        cursor: Cursor,
        args: CreateFunctionArgument[],
        returns: CreateFunctionReturns
    ) {
        const allNames = args.map((argument) => argument.row.name);
        if ( "table" in returns.row ) {
            const returnsNames = returns.row.table.map((argument) =>
                argument.row.name
            );
            allNames.push(...returnsNames);
        }

        const reservedNamesMap: Record<string, boolean> = {};
        for (const nameNode of allNames) {
            if ( !nameNode ) {
                continue;
            }

            const name = nameNode.toString();
            if ( name in reservedNamesMap ) {
                cursor.throwError(
                    `parameter name "${name}" used more than once`,
                    nameNode
                );
            }

            reservedNamesMap[ name ] = true;
        }
    }

    template(): TemplateElement[] {
        const function_ = this.row;

        return [
            ...phrase("create or replace function"),
            ...this.printName(), ...this.printArgs(),
            function_.returns, _,
            keyword("as"), function_.body, eol,
            ...this.printOptions()
        ];
    }

    private printName() {
        const procedure = this.row;
        if ( procedure.schema ) {
            return [procedure.schema, ".", procedure.name];
        }
        return [procedure.name];
    }

    private printArgs() {
        const {args} = this.row;

        if ( args.length === 0 ) {
            return ["()", eol];
        }

        if ( args.length === 1 ) {
            return ["(", args[0], ")", eol];
        }

        return [
            "(", eol,
            tab, ...printChain(
                args, ",", eol,
                tab
            ), eol,
            ")", _
        ];
    }

    private printOptions() {
        const options = this.row;

        const output: TemplateElement[] = [
            keyword("language"), keyword(options.language)
        ];

        if ( options.immutability ) {
            output.push(eol, keyword(options.immutability));
        }
        if ( options.inputNullsRule ) {
            output.push(eol, ...phrase(options.inputNullsRule));
        }
        if ( options.parallel ) {
            output.push(eol, keyword("parallel"), keyword(options.parallel));
        }
        if ( options.cost ) {
            output.push(eol, keyword("cost"), options.cost);
        }

        return output;
    }
}

function phrase(words: string) {
    return words.split(" ").map(keyword);
}