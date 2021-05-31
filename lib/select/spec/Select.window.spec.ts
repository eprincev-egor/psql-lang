import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.window.spec.ts: select ... window", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
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

        Sql.assertNode(Select, {
            input: `SELECT depname, empno, salary, avg(salary) OVER (PARTITION BY depname)
            FROM empsalary`,
            shouldBe: {
                json: {
                    select: [
                        {expression: {column: [
                            {name: "depname"}
                        ]}},
                        {expression: {column: [
                            {name: "empno"}
                        ]}},
                        {expression: {column: [
                            {name: "salary"}
                        ]}},
                        {
                            expression: {
                                call: {name: {name: "avg"}},
                                arguments: [
                                    {column: [
                                        {name: "salary"}
                                    ]}
                                ],
                                over: {
                                    partitionBy: [
                                        {column: [
                                            {name: "depname"}
                                        ]}
                                    ]
                                }
                            }
                        }
                    ],
                    from: [{
                        table: {
                            name: {name: "empsalary"}
                        }
                    }]
                },
                pretty: [
                    "select",
                    "    depname,",
                    "    empno,",
                    "    salary,",
                    "    avg(salary)",
                    "    over (",
                    "        partition by",
                    "            depname",
                    "    )",
                    "from empsalary"
                ].join("\n"),
                minify:
                    "select depname,empno,salary,avg(salary)over(partition by depname)from empsalary"
            }
        });

    });

});