import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.with.spec.ts: with ... select", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select name from users where users.name is not null",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    where: {operand: {
                        operand: {column: [
                            {name: "users"},
                            {name: "name"}
                        ]},
                        postOperator: "is not null"
                    }}
                },
                pretty: [
                    "select",
                    "    name",
                    "from users",
                    "where",
                    "    users.name is not null"
                ].join("\n")
            }
        });

        assertNode(Select, {
            input: "select 1 where false",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            number: "1"
                        }}}
                    ],
                    from: [],
                    where: {operand: {
                        boolean: false
                    }}
                },
                pretty: [
                    "select",
                    "    1",
                    "where",
                    "    false"
                ].join("\n")
            }
        });

        assertNode(Select, {
            input: `
                select
                    max(orders.profit)
                from orders
                having
                    sum(orders.profit) > 1000
            `.trim(),
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            call: {
                                name: {name: "max"}
                            },
                            arguments: [{operand: {
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "orders"}
                        }
                    }],
                    having: {operand: {
                        left: {
                            call: {
                                name: {name: "sum"}
                            },
                            arguments: [{operand: {
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }}]
                        },
                        operator: ">",
                        right: {number: "1000"}
                    }}
                },
                pretty: [
                    "select",
                    "    max(orders.profit)",
                    "from orders",
                    "having",
                    "    sum(orders.profit) > 1000"
                ].join("\n"),
                minify: "select max(orders.profit)from orders having sum(orders.profit)>1000"
            }
        });

        assertNode(Select, {
            input: `
                select
                    max(orders.profit)
                from orders
                where
                    orders.year > 2010
                having
                    sum(orders.profit) > 1000
            `.trim(),
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            call: {
                                name: {name: "max"}
                            },
                            arguments: [{operand: {
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "orders"}
                        }
                    }],
                    where: {operand: {
                        left: {column: [
                            {name: "orders"},
                            {name: "year"}
                        ]},
                        operator: ">",
                        right: {number: "2010"}
                    }},
                    having: {operand: {
                        left: {
                            call: {
                                name: {name: "sum"}
                            },
                            arguments: [{operand: {
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }}]
                        },
                        operator: ">",
                        right: {number: "1000"}
                    }}
                },
                pretty: [
                    "select",
                    "    max(orders.profit)",
                    "from orders",
                    "where",
                    "    orders.year > 2010",
                    "having",
                    "    sum(orders.profit) > 1000"
                ].join("\n"),
                minify: "select max(orders.profit)from orders where orders.year>2010 having sum(orders.profit)>1000"
            }
        });

    });

});