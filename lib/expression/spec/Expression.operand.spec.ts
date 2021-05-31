import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.operand.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "100",
            shouldBe: {
                json: {
                    operand: {number: "100"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "-4",
            shouldBe: {
                json: {
                    operand: {number: "-4"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "'string'",
            shouldBe: {
                json: {
                    operand: {string: "string"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "E'Estring'",
            shouldBe: {
                json: {
                    operand: {string: "Estring", escape: true}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "U&'Ustring'",
            shouldBe: {
                json: {
                    operand: {string: "Ustring", unicodeEscape: "\\"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "$dol1lar$dollar\nstring$dol1lar$",
            shouldBe: {
                json: {
                    operand: {string: "dollar\nstring", tag: "dol1lar"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.inn",
            shouldBe: {
                json: {
                    operand: {column: [
                        {name: "company"},
                        {name: "inn"}
                    ]}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "false",
            shouldBe: {
                json: {
                    operand: {boolean: false}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "null",
            shouldBe: {
                json: {
                    operand: {null: true}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "$lang",
            shouldBe: {
                json: {
                    operand: {variable: "lang"}
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "ARRAY[1,2,3]",
            shouldBe: {
                json: {
                    operand: {array: [
                        {number: "1"},
                        {number: "2"},
                        {number: "3"}
                    ]}
                },
                pretty: "array[1, 2, 3]",
                minify: "array[1,2,3]"
            }
        });

        Sql.assertNode(Expression, {
            input: "case when true then 1 else 0 end",
            shouldBe: {
                json: {
                    operand: {
                        case: [{
                            when: {boolean: true},
                            then: {number: "1"}
                        }],
                        else: {number: "0"}
                    }
                },
                pretty: [
                    "case",
                    "    when true",
                    "    then 1",
                    "    else 0",
                    "end"
                ].join("\n")
            }
        });

        Sql.assertNode(Expression, {
            input: "now ( )",
            shouldBe: {
                json: {
                    operand: {
                        call: {
                            name: {name: "now"}
                        },
                        arguments: []
                    }
                },
                pretty: "now()",
                minify: "now()"
            }
        });

        Sql.assertNode(Expression, {
            input: "public.some_func(1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        call: {
                            schema: {name: "public"},
                            name: {name: "some_func"}
                        },
                        arguments: [
                            {number: "1"},
                            {number: "2"}
                        ]
                    }
                },
                minify: "public.some_func(1,2)"
            }
        });

        Sql.assertNode(Expression, {
            input: "now_utc()",
            shouldBe: {
                json: {
                    operand: {
                        call: {
                            name: {name: "now_utc"}
                        },
                        arguments: []
                    }
                },
                minify: "now_utc()"
            }
        });

        Sql.assertNode(Expression, {
            input: "(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        subQuery: {
                            select: [
                                {expression: {number: "1"}}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "(",
                    "    select",
                    "        1",
                    ")"
                ].join("\n")
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Expression, {
            input: "::",
            throws: /expected expression operand/,
            target: ":"
        });

        Sql.assertNode(Expression, {
            input: "a.b.c()",
            throws: /improper qualified name \(too many dotted names\): a\.b\.c/,
            target: "c"
        });

        Sql.assertNode(Expression, {
            input: "(select) + 1",
            throws: /expected one column for subquery/,
            target: "select"
        });

        Sql.assertNode(Expression, {
            input: "(select hello, world as x) + 1",
            throws: /subquery must return only one column/,
            target: "world as x"
        });

    });

});