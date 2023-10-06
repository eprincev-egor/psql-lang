import { CreateFunction } from "../CreateFunction";
import { Sql } from "../../Sql";
import { NodeJson } from "abstract-lang";
import { StringLiteralRow } from "../../expression";
import { CreateFunctionReturnsRow } from "../CreateFunctionReturns";

describe("CreateFunction.spec.ts", () => {

    const bodyJson: NodeJson<StringLiteralRow> = {
        tag: "body",
        string: "begin return 1 end"
    };
    const $body$ = `$${bodyJson.tag}$${bodyJson.string}$${bodyJson.tag}$`;

    const returnsJson: NodeJson<CreateFunctionReturnsRow> = {
        setOf: false,
        type: {type: "integer"}
    };

    it("valid inputs", () => {

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function operation.test()",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    schema: {name: "operation"},
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function operation.test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create function test()",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create procedure test()",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace procedure test()",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language sql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "sql"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language sql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(a text)",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [{
                        name: {name: "a"},
                        type: {type: "text"}
                    }],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test(a text)returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(a text, b integer)",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [
                        {
                            name: {name: "a"},
                            type: {type: "text"}
                        },
                        {
                            name: {name: "b"},
                            type: {type: "integer"}
                        }
                    ],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test(a text,b integer)returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test(",
                    "    a text,",
                    "    b integer",
                    `) returns integer as ${$body$}`,
                    "language plpgsql"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns table(xx text) as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {
                        setOf: false,
                        table: [{
                            name: {name: "xx"},
                            type: {type: "text"}
                        }]
                    },
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns",
                    `table(xx text)as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns table(xx text, yy bigint) as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {
                        setOf: false,
                        table: [
                            {
                                name: {name: "xx"},
                                type: {type: "text"}
                            },
                            {
                                name: {name: "yy"},
                                type: {type: "bigint"}
                            }
                        ]
                    },
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns",
                    `table(xx text,yy bigint)as ${$body$}`,
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    "returns table(",
                    "    xx text,",
                    "    yy bigint",
                    `) as ${$body$}`,
                    "language plpgsql"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(a text default 'hello')",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [{
                        name: {name: "a"},
                        type: {type: "text"},
                        default: {string: "hello"}
                    }],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test(a text default 'hello')returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(a text default null)",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [{
                        name: {name: "a"},
                        type: {type: "text"},
                        default: {null: true}
                    }],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test(a text default null)returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "immutable"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "stable"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "stable"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql stable"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "volatile"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "volatile"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql volatile"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "strict"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    inputNullsRule: "strict"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql strict"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "returns null on null input"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    inputNullsRule: "returns null on null input"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql returns null on null input"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "called on null input"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    inputNullsRule: "called on null input"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql called on null input"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "immutable",
                "strict"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable",
                    inputNullsRule: "strict"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable strict"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "parallel unsafe"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    parallel: "unsafe"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql parallel unsafe"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "parallel safe"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    parallel: "safe"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql parallel safe"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "parallel restricted"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    parallel: "restricted"
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql parallel restricted"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "cost 100"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    cost: {number: "100"}
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql cost 100"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer as ${$body$}`,
                "language plpgsql",
                "immutable",
                "returns null on null input",
                "parallel unsafe",
                "cost 100"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable",
                    inputNullsRule: "returns null on null input",
                    parallel: "unsafe",
                    cost: {number: "100"}
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable returns null on null input parallel unsafe cost 100"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                "returns integer",
                "language plpgsql",
                "immutable",
                "returns null on null input",
                "parallel unsafe",
                "cost 100",
                `as ${$body$}`
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable",
                    inputNullsRule: "returns null on null input",
                    parallel: "unsafe",
                    cost: {number: "100"}
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable returns null on null input parallel unsafe cost 100"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql",
                    "immutable",
                    "returns null on null input",
                    "parallel unsafe",
                    "cost 100"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                "returns integer",
                "returns null on null input",
                "parallel unsafe",
                "cost 100",
                `as ${$body$}`,
                "language plpgsql",
                "immutable"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable",
                    inputNullsRule: "returns null on null input",
                    parallel: "unsafe",
                    cost: {number: "100"}
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable returns null on null input parallel unsafe cost 100"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql",
                    "immutable",
                    "returns null on null input",
                    "parallel unsafe",
                    "cost 100"
                ].join("\n")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "CREATE OR REPLACE FUNCTION test()",
                "RETURNS INTEGER",
                "RETURNS NULL ON NULL INPUT",
                "PARALLEL UNSAFE",
                "COST 100",
                `AS ${$body$}`,
                "LANGUAGE PLPGSQL",
                "IMMUTABLE"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql",
                    immutability: "immutable",
                    inputNullsRule: "returns null on null input",
                    parallel: "unsafe",
                    cost: {number: "100"}
                },
                minify: [
                    "create or replace function test()returns integer",
                    `as ${$body$}`,
                    "language plpgsql immutable returns null on null input parallel unsafe cost 100"
                ].join(" "),
                pretty: [
                    "create or replace function test()",
                    `returns integer as ${$body$}`,
                    "language plpgsql",
                    "immutable",
                    "returns null on null input",
                    "parallel unsafe",
                    "cost 100"
                ].join("\n")
            }
        });


        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns setof public.list_company as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {
                        setOf: true,
                        type: {type: "public.list_company"}
                    },
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns setof public.list_company",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns setof table(xx text) as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {
                        setOf: true,
                        table: [{
                            name: {name: "xx"},
                            type: {type: "text"}
                        }]
                    },
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns",
                    `setof table(xx text)as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns integer[] as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {setOf: false, type: {
                        type: "integer[]"
                    }},
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns integer[]",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(companies public.list_company[])",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [{
                        name: {name: "companies"},
                        type: {type: "public.list_company[]"}
                    }],
                    body: bodyJson,
                    returns: returnsJson,
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test(companies public.list_company[])returns integer",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns void as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {setOf: false, type: {type: "void"}},
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns void",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns trigger as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            shouldBe: {
                json: {
                    name: {name: "test"},
                    args: [],
                    body: bodyJson,
                    returns: {setOf: false, type: {type: "trigger"}},
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test()returns trigger",
                    `as ${$body$}`,
                    "language plpgsql"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateFunction, {
            input: `create /* multi */ or /* line */ replace /* comment */ function /* here */
            TEST_NAME(xid integer, names text[] /* or here */)
            -- returns table(
            returns table(
                id integer, 
                -- inline comment here
                sum numeric
                -- inline comment here
            ) as $body$begin;/* but not here */end$body$
            language plpgsql;
        `,
            shouldBe: {
                json: {
                    name: {name: "test_name"},
                    args: [
                        {
                            name: {name: "xid"},
                            type: {type: "integer"}
                        },
                        {
                            name: {name: "names"},
                            type: {type: "text[]"}
                        }
                    ],
                    body: {
                        tag: "body",
                        string: "begin;/* but not here */end"
                    },
                    returns: {
                        setOf: false,
                        table: [
                            {
                                name: {name: "id"},
                                type: {type: "integer"}
                            },
                            {
                                name: {name: "sum"},
                                type: {type: "numeric"}
                            }
                        ]
                    },
                    language: "plpgsql"
                },
                minify: [
                    "create or replace function test_name(xid integer,names text[])returns table(id integer,sum numeric)as",
                    "$body$begin;/* but not here */end$body$",
                    "language plpgsql"
                ].join(" "),
                pretty: [
                    "create or replace function test_name(",
                    "    xid integer,",
                    "    names text[]",
                    ") returns table(",
                    "    id integer,",
                    "    sum numeric",
                    ") as $body$begin;/* but not here */end$body$",
                    "language plpgsql"
                ].join("\n")
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(id text, id integer)",
                `returns integer as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            throws: /parameter name "id" used more than once/
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test(id text)",
                `returns table (id integer) as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            throws: /parameter name "id" used more than once/
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns table (id text, id integer) as ${$body$}`,
                "language plpgsql"
            ].join("\n"),
            throws: /parameter name "id" used more than once/
        });

        Sql.assertNode(CreateFunction, {
            input: [
                "create or replace function test()",
                `returns void as ${$body$}`
            ].join("\n"),
            throws: /expected function language/
        });

    });

});