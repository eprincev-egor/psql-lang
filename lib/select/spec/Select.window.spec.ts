import { assertNode } from "abstract-lang";
import { Select } from "../Select";

describe("Select.window.spec.ts: select ... window", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select from company window x as (order by company.name), y as (order by company.id)",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "company"}
                        }
                    }],
                    window: [
                        {
                            as: {name: "x"},
                            window: {
                                orderBy: [{
                                    expression: {column: [
                                        {name: "company"},
                                        {name: "name"}
                                    ]},
                                    vector: "asc"
                                }]
                            }
                        },
                        {
                            as: {name: "y"},
                            window: {
                                orderBy: [{
                                    expression: {column: [
                                        {name: "company"},
                                        {name: "id"}
                                    ]},
                                    vector: "asc"
                                }]
                            }
                        }
                    ]
                },
                pretty: [
                    "select",
                    "from company",
                    "window",
                    "    x as (",
                    "        order by",
                    "            company.name asc",
                    "    ),",
                    "    y as (",
                    "        order by",
                    "            company.id asc",
                    "    )"
                ].join("\n"),
                minify: "select from company window x as(order by company.name asc),y as(order by company.id asc)"
            }
        });

    });

});