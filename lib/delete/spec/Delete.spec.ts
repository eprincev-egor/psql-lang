import { Sql } from "../../Sql";
import { Delete } from "../Delete";

describe.only("Delete.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Delete, {
            input: "delete from companies",
            shouldBe: {
                json: {
                    delete: {name: {name: "companies"}}
                },
                pretty: [
                    "delete from companies"
                ].join("\n"),
                minify: "delete from companies"
            }
        });

        Sql.assertNode(Delete, {
            input: "delete from only companies",
            shouldBe: {
                json: {
                    delete: {name: {name: "companies"}},
                    only: true
                },
                pretty: [
                    "delete from only companies"
                ].join("\n"),
                minify: "delete from only companies"
            }
        });

        Sql.assertNode(Delete, {
            input: "delete from companies *",
            shouldBe: {
                json: {
                    delete: {name: {name: "companies"}},
                    star: true
                },
                pretty: [
                    "delete from companies *"
                ].join("\n"),
                minify: "delete from companies*"
            }
        });

        Sql.assertNode(Delete, {
            input: "delete from only companies *",
            shouldBe: {
                json: {
                    delete: {name: {name: "companies"}},
                    only: true,
                    star: true
                },
                pretty: [
                    "delete from only companies *"
                ].join("\n"),
                minify: "delete from only companies*"
            }
        });

        Sql.assertNode(Delete, {
            input: "delete from only orders * as Order",
            shouldBe: {
                json: {
                    delete: {name: {name: "orders"}},
                    only: true,
                    star: true,
                    as: {name: "order"}
                },
                pretty: [
                    "delete from only orders * as order"
                ].join("\n"),
                minify: "delete from only orders*as order"
            }
        });

        Sql.assertNode(Delete, {
            input: `delete from orders
            using companies
            where
                orders.id_client = companies.id and
                companies.name ilike '%ooo%'`,
            shouldBe: {
                json: {
                    delete: {name: {name: "orders"}},
                    using: [
                        {table: {name: {name: "companies"}}}
                    ],
                    where: {
                        left: {
                            left: {column: [{name: "orders"}, {name: "id_client"}]},
                            operator: "=",
                            right: {column: [{name: "companies"}, {name: "id"}]}
                        },
                        operator: "and",
                        right: {
                            left: {column: [{name: "companies"}, {name: "name"}]},
                            operator: "ilike",
                            right: {string: "%ooo%"}
                        }
                    }
                },
                pretty: [
                    "delete from orders",
                    "using",
                    "    companies",
                    "where",
                    "    orders.id_client = companies.id and companies.name ilike '%ooo%'"
                ].join("\n"),
                minify: "delete from orders using companies where orders.id_client=companies.id and companies.name ilike '%ooo%'"
            }
        });

        Sql.assertNode(Delete, {
            input: `with
            some_orders as (select * from orders)

            delete from companies
            where
                companies.id = (select id_client from some_orders)
            `,
            shouldBe: {
                json: {
                    with: {
                        queries: [{
                            name: {name: "some_orders"},
                            query: {
                                select: [
                                    {expression: {column: [], allColumns: true}}
                                ],
                                from: [{table: {name: {name: "orders"}}}]
                            }
                        }]
                    },
                    delete: {name: {name: "companies"}},
                    where: {
                        left: {column: [{name: "companies"}, {name: "id"}]},
                        operator: "=",
                        right: {subQuery: {
                            select: [
                                {expression: {column: [{name: "id_client"}]}}
                            ],
                            from: [{table: {name: {name: "some_orders"}}}]
                        }}
                    }
                },
                pretty: [
                    "with",
                    "    some_orders as (",
                    "        select",
                    "            *",
                    "        from orders",
                    "    )",
                    "delete from companies",
                    "where",
                    "    companies.id = (",
                    "        select",
                    "            id_client",
                    "        from some_orders",
                    "    )"
                ].join("\n"),
                minify: "with some_orders as(select*from orders)delete from companies where companies.id=(select id_client from some_orders)"
            }
        });

        Sql.assertNode(Delete, {
            input: "delete from companies returning *",
            shouldBe: {
                json: {
                    delete: {name: {name: "companies"}},
                    returning: [{expression: {column: [], allColumns: true}}]
                },
                pretty: [
                    "delete from companies",
                    "returning",
                    "    *"
                ].join("\n"),
                minify: "delete from companies returning*"
            }
        });

    });


});