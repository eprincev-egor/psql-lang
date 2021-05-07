import { assertNode } from "abstract-lang";
import { Select } from "../Select";

describe("Select.fromSubQuery.spec.ts: select ... from (...)", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select id from (select 1 as id) as tmp",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [
                                {name: "id"}
                            ]
                        }}
                    ],
                    from: [{
                        subQuery: {
                            select: [
                                {
                                    expression: {number: "1"},
                                    as: {name: "id"}
                                }
                            ],
                            from: []
                        },
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "    id",
                    "from (",
                    "    select",
                    "        1 as id",
                    ") as tmp"
                ].join("\n"),
                minify: "select id from(select 1 as id)as tmp"
            }
        });

        assertNode(Select, {
            input: "select from (select) tmp",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        subQuery: {
                            select: [],
                            from: []
                        },
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "from (",
                    "    select",
                    ") as tmp"
                ].join("\n"),
                minify: "select from(select)as tmp"
            }
        });

    });

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select from (select)",
            throws: /subquery in FROM must have an alias/
        });

    });

});