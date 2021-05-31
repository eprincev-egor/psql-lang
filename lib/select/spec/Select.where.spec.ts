import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.with.spec.ts: with ... select", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select name from users where users.name is not null",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [{name: "name"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    where: {
                        operand: {column: [
                            {name: "users"},
                            {name: "name"}
                        ]},
                        postOperator: "is not null"
                    }
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

        Sql.assertNode(Select, {
            input: "select 1 where false",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    where: {boolean: false}
                },
                pretty: [
                    "select",
                    "    1",
                    "where",
                    "    false"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
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
                        {expression: {
                            call: {
                                name: {name: "max"}
                            },
                            arguments: [{
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "orders"}
                        }
                    }],
                    having: {
                        left: {
                            call: {
                                name: {name: "sum"}
                            },
                            arguments: [{
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }]
                        },
                        operator: ">",
                        right: {number: "1000"}
                    }
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

        Sql.assertNode(Select, {
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
                        {expression: {
                            call: {
                                name: {name: "max"}
                            },
                            arguments: [{
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "orders"}
                        }
                    }],
                    where: {
                        left: {column: [
                            {name: "orders"},
                            {name: "year"}
                        ]},
                        operator: ">",
                        right: {number: "2010"}
                    },
                    having: {
                        left: {
                            call: {
                                name: {name: "sum"}
                            },
                            arguments: [{
                                column: [
                                    {name: "orders"},
                                    {name: "profit"}
                                ]
                            }]
                        },
                        operator: ">",
                        right: {number: "1000"}
                    }
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