import {
    AbstractNode, Cursor,
    TemplateElement,
    _, eol, keyword, printChain
} from "abstract-lang";
import { Name } from "../base";
import { Expression, FunctionReference, Operand } from "../expression";
import { TableReference } from "../select";

export interface CreateTriggerRow {
    name: Name;
    table: TableReference;
    events: TriggerEvents;
    procedure: FunctionReference;
    constraint?: boolean;
    statement?: boolean;
    deferrable?: boolean;
    initially?: "immediate" | "deferred";
    when?: Operand;
}

export interface TriggerEvents {
    before?: boolean;
    insert?: boolean;
    update?: boolean | Name[];
    delete?: boolean;
}

export class CreateTrigger extends AbstractNode<CreateTriggerRow> {

    static entry(cursor: Cursor): boolean {
        return (
            cursor.beforePhrase("create", "trigger") ||
            cursor.beforePhrase("create", "constraint", "trigger")
        );
    }

    static parse(cursor: Cursor): CreateTriggerRow {
        const constraint = this.parseConstraint(cursor);

        const name = cursor.parse(Name);
        cursor.skipSpaces();

        const events = this.parseEvents(cursor);
        const table = this.parseTable(cursor);
        const deferrable = this.parseDeferrable(cursor);
        const initially = this.parseInitially(cursor);
        const statement = this.parseStatement(cursor);
        const when = this.parseWhen(cursor);
        const procedure = this.parseProcedure(cursor);

        const row: CreateTriggerRow = {
            name,
            events,
            table,
            procedure
        };
        if ( constraint ) {
            row.constraint = true;
        }
        if ( deferrable != null ) {
            row.deferrable = deferrable;
        }
        if ( initially ) {
            row.initially = initially;
        }
        if ( statement ) {
            row.statement = true;
        }
        if ( when ) {
            row.when = when;
        }
        return row;
    }

    private static parseConstraint(cursor: Cursor) {
        cursor.readWord("create");

        if ( cursor.beforeWord("constraint") ) {
            cursor.readPhrase("constraint", "trigger");
            return true;
        }

        cursor.readWord("trigger");
    }

    private static parseEvents(cursor: Cursor) {
        const events: TriggerEvents = {};

        if ( cursor.beforeWord("before") ) {
            cursor.readWord("before");
            events.before = true;
        }
        else {
            cursor.readWord("after");
        }

        this.parseEvent(cursor, events);

        return events;
    }

    private static parseEvent(
        cursor: Cursor,
        events: TriggerEvents
    ) {
        if ( cursor.beforeWord("insert") ) {
            cursor.readWord("insert");
            events.insert = true;
        }
        else if ( cursor.beforeWord("update") ) {
            cursor.readWord("update");
            events.update = true;

            if ( cursor.beforeWord("of") ) {
                cursor.readWord("of");
                events.update = cursor.parseChainOf(Name, ",");
            }
        }
        else if ( cursor.beforeWord("delete") ) {
            cursor.readWord("delete");
            events.delete = true;
        }

        if ( cursor.beforeWord("or") ) {
            cursor.readWord("or");
            this.parseEvent(cursor, events);
        }
    }

    private static parseTable(cursor: Cursor) {
        cursor.readWord("on");

        const table = cursor.parse(TableReference);

        cursor.skipSpaces();
        return table;
    }

    private static parseDeferrable(cursor: Cursor) {
        if ( cursor.beforePhrase("not", "deferrable") ) {
            cursor.readPhrase("not", "deferrable");
            return false;
        }

        if ( cursor.beforeWord("deferrable") ) {
            cursor.readWord("deferrable");
            return true;
        }
    }

    private static parseInitially(cursor: Cursor): CreateTriggerRow["initially"] {
        if ( !cursor.beforeWord("initially") ) {
            return;
        }
        cursor.readWord("initially");

        if ( cursor.beforeWord("immediate") ) {
            cursor.readWord("immediate");
            return "immediate";
        }

        cursor.readWord("deferred");
        return "deferred";
    }

    private static parseStatement(cursor: Cursor) {
        cursor.readPhrase("for", "each");

        if ( cursor.beforeWord("statement") ) {
            cursor.readWord("statement");
            return true;
        }

        cursor.readWord("row");
    }

    private static parseWhen(cursor: Cursor) {
        if ( !cursor.beforeWord("when") ) {
            return;
        }

        cursor.readWord("when");
        const when = cursor.parse(Expression).operand();

        cursor.skipSpaces();
        return when;
    }

    private static parseProcedure(cursor: Cursor) {
        cursor.readWord("execute");

        if ( cursor.beforeWord("function") ) {
            cursor.readWord("function");
        }
        else {
            cursor.readWord("procedure");
        }

        const procedure = cursor.parse(FunctionReference);

        cursor.skipSpaces();
        cursor.readValue("(");
        cursor.skipSpaces();
        cursor.readValue(")");

        return procedure;
    }

    template(): TemplateElement[] {
        const createTrigger = this.printCreateTrigger();
        const deferrable = this.printDeferrable();
        const forEach = this.row.statement ? "statement" : "row";
        const events = this.printEvents();
        const when = this.printWhen();

        return [
            ...createTrigger, this.row.name, eol,
            ...events, eol,
            keyword("on"), this.row.table, eol,
            ...deferrable,
            keyword("for"), keyword("each"), keyword(forEach), eol,
            ...when,
            keyword("execute"), keyword("procedure"), this.row.procedure, "()"
        ];
    }

    private printCreateTrigger() {
        if ( this.row.constraint ) {
            return [
                keyword("create"),
                keyword("constraint"),
                keyword("trigger")
            ];
        }

        return [keyword("create"), keyword("trigger")];
    }

    private printDeferrable() {
        const initially = this.printInitially();

        if ( this.row.deferrable === false ) {
            return [
                keyword("not"),
                keyword("deferrable"),
                ...initially,
                eol
            ];
        }

        if ( this.row.deferrable === true ) {
            return [
                keyword("deferrable"),
                ...initially,
                eol
            ];
        }

        return [];
    }

    private printInitially() {
        if ( this.row.initially === "immediate" ) {
            return [
                keyword("initially"),
                keyword("immediate")
            ];
        }

        if ( this.row.initially === "deferred" ) {
            return [
                keyword("initially"),
                keyword("deferred")
            ];
        }

        return [];
    }

    private printEvents() {
        const events = this.row.events;
        const output: TemplateElement[] = [];

        if ( events.before ) {
            output.push(keyword("before"));
        }
        else {
            output.push(keyword("after"));
        }

        if ( events.insert ) {
            output.push(keyword("insert"));
        }

        if ( events.update ) {
            if ( events.insert ) {
                output.push(keyword("or"));
            }

            output.push(keyword("update"));

            if ( Array.isArray(events.update) ) {
                output.push(keyword("of"));
                output.push(...printChain(
                    events.update,
                    ",", _
                ));
            }
        }

        if ( events.delete ) {
            if ( events.insert || events.update ) {
                output.push(keyword("or"));
            }
            output.push(keyword("delete"));
        }

        return output;
    }

    private printWhen() {
        if ( !this.row.when ) {
            return [];
        }

        return [
            keyword("when"), _, this.row.when, eol
        ];
    }
}