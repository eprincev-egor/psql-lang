import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.with.spec.ts: with ... select", () => {

    it("valid inputs", () => {

        const query = {
            select: [{
                expression: {number: "1"},
                as: {name: "id"}
            }],
            from: []
        };
        const select = [{
            expression: {
                allColumns: true,
                column: [
                    {name: "companies"}
                ]
            }
        }];
        const from = [{
            table: {
                name: {name: "companies"}
            }
        }];

        Sql.assertNode(Select, {
            input: [
                "with",
                "    companies as (",
                "        select",
                "            1 as id",
                "    )",
                "select",
                "    companies.*",
                "from companies"
            ].join("\n"),
            shouldBe: {
                json: {
                    with: {
                        queries: [{
                            name: {name: "companies"},
                            query
                        }]
                    },
                    select, from
                },
                minify: [
                    "with companies as(select 1 as id)",
                    "select companies.* from companies"
                ].join("")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "with recursive",
                "    companies as (",
                "        select",
                "            1 as id",
                "    )",
                "select",
                "    companies.*",
                "from companies"
            ].join("\n"),
            shouldBe: {
                json: {
                    with: {
                        recursive: true,
                        queries: [{
                            name: {name: "companies"},
                            query
                        }]
                    },
                    select, from
                },
                minify: [
                    "with recursive companies as(select 1 as id)",
                    "select companies.* from companies"
                ].join("")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "((with",
                "    companies as (",
                "        select",
                "            1 as id",
                "    )",
                "select",
                "    companies.*",
                "from companies))"
            ].join("\n"),
            shouldBe: {
                json: {
                    with: {
                        queries: [{
                            name: {name: "companies"},
                            query
                        }]
                    },
                    select, from,
                    bracketsBeforeWith: 2
                },
                pretty: [
                    "((with",
                    "    companies as (",
                    "        select",
                    "            1 as id",
                    "    )",
                    "select",
                    "    companies.*",
                    "from companies))"
                ].join("\n"),
                minify: [
                    "((with companies as(select 1 as id)",
                    "select companies.* from companies))"
                ].join("")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "((with",
                "    companies as (",
                "        select",
                "            1 as id",
                "    )",
                "((select",
                "    companies.*",
                "from companies))))"
            ].join("\n"),
            shouldBe: {
                json: {
                    with: {
                        queries: [{
                            name: {name: "companies"},
                            query
                        }]
                    },
                    select, from,
                    bracketsBeforeWith: 2,
                    bracketsBeforeSelect: 2
                },
                pretty: [
                    "((with",
                    "    companies as (",
                    "        select",
                    "            1 as id",
                    "    )",
                    "((select",
                    "    companies.*",
                    "from companies))))"
                ].join("\n"),
                minify: [
                    "((with companies as(select 1 as id)",
                    "((select companies.* from companies))))"
                ].join("")
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Select, {
            input: `with
                a as (select),
                a as (select)
            select 1
            `,
            throws: /WITH query name "a" specified more than once/,
            target: "a"
        });

    });

});