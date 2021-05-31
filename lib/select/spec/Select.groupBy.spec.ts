import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.groupBy.spec.ts: select ... group by", () => {

    it("valid inputs", () => {

        const select: ReturnType< Select["toJSON"] >["select"] = [
            {expression: {
                arguments: [
                    {number: "1"}
                ],
                call: {name: {name: "sum"}}
            }}
        ];
        const from: ReturnType< Select["toJSON"] >["from"] = [{
            table: {
                name: {name: "orders"}
            }
        }];

        Sql.assertNode(Select, {
            input: "select sum(1) from orders group by orders.date",
            shouldBe: {
                json: {
                    select, from,
                    groupBy: [
                        {expression: {
                            column: [
                                {name: "orders"},
                                {name: "date"}
                            ]
                        }}
                    ]
                },
                pretty: [
                    "select",
                    "    sum(1)",
                    "from orders",
                    "group by",
                    "    orders.date"
                ].join("\n"),
                minify: "select sum(1)from orders group by orders.date"
            }
        });

        Sql.assertNode(Select, {
            input: "select sum(1) from orders group by orders.client_id, orders.date",
            shouldBe: {
                json: {
                    select, from,
                    groupBy: [
                        {expression: {
                            column: [
                                {name: "orders"},
                                {name: "client_id"}
                            ]
                        }},
                        {expression: {
                            column: [
                                {name: "orders"},
                                {name: "date"}
                            ]
                        }}
                    ]
                },
                pretty: [
                    "select",
                    "    sum(1)",
                    "from orders",
                    "group by",
                    "    orders.client_id,",
                    "    orders.date"
                ].join("\n"),
                minify: "select sum(1)from orders group by orders.client_id,orders.date"
            }
        });

    });

});