import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

describe("Expression.operand.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "100",
            shouldBe: {
                json: {
                    operand: {number: "100"}
                }
            }
        });

        assertNode(Expression, {
            input: "-4",
            shouldBe: {
                json: {
                    operand: {number: "-4"}
                }
            }
        });

        assertNode(Expression, {
            input: "'string'",
            shouldBe: {
                json: {
                    operand: {string: "string"}
                }
            }
        });

        assertNode(Expression, {
            input: "E'Estring'",
            shouldBe: {
                json: {
                    operand: {string: "Estring", escape: true}
                }
            }
        });

        assertNode(Expression, {
            input: "U&'Ustring'",
            shouldBe: {
                json: {
                    operand: {string: "Ustring", unicodeEscape: "\\"}
                }
            }
        });

        assertNode(Expression, {
            input: "$dol1lar$dollar\nstring$dol1lar$",
            shouldBe: {
                json: {
                    operand: {string: "dollar\nstring", tag: "dol1lar"}
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "false",
            shouldBe: {
                json: {
                    operand: {boolean: false}
                }
            }
        });

        assertNode(Expression, {
            input: "null",
            shouldBe: {
                json: {
                    operand: {null: true}
                }
            }
        });

        assertNode(Expression, {
            input: "$lang",
            shouldBe: {
                json: {
                    operand: {variable: "lang"}
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "::",
            throws: /expected expression operand/,
            target: ":"
        });

        assertNode(Expression, {
            input: "a.b.c()",
            throws: /improper qualified name \(too many dotted names\): a\.b\.c/,
            target: "c"
        });

        assertNode(Expression, {
            input: "(select) + 1",
            throws: /expected one column for subquery/,
            target: "select"
        });

        assertNode(Expression, {
            input: "(select hello, world as x) + 1",
            throws: /subquery must return only one column/,
            target: "world as x"
        });

    });

});