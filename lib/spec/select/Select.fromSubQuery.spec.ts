import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.fromSubQuery.spec.ts: select ... from (...)", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select id from (select 1 as id) as tmp",
            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {operand: {
                                column: [
                                    {name: "id"}
                                ]
                            }}
                        }
                    ],
                    from: [{
                        subQuery: {
                            select: [
                                {
                                    expression: {operand: {
                                        number: "1"
                                    }},
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

    });

});