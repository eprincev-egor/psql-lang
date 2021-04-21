import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.with.spec.ts: with ... select", () => {

    it("valid inputs", () => {

        assertNode(Select, {
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
                            query: {
                                select: [{
                                    expression: {operand: {
                                        number: "1"
                                    }},
                                    as: {name: "id"}
                                }],
                                from: []
                            }
                        }]
                    },
                    select: [{
                        expression: {operand: {
                            allColumns: true,
                            column: [
                                {name: "companies"}
                            ]
                        }}
                    }],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        }
                    }]
                },
                minify: [
                    "with companies as(select 1 as id)",
                    "select companies.* from companies"
                ].join("")
            }
        });

    });

});