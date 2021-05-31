import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.fromValues.spec.ts: select ... from (values ...)", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select from (values (1, 2), (3, 4))tmp(a,b)",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        values: [
                            {values: [
                                {value: {number: "1"}},
                                {value: {number: "2"}}
                            ]},
                            {values: [
                                {value: {number: "3"}},
                                {value: {number: "4"}}
                            ]}
                        ],
                        as: {name: "tmp"},
                        columnAliases: [
                            {name: "a"},
                            {name: "b"}
                        ]
                    }]
                },
                pretty: [
                    "select",
                    "from (",
                    "    values",
                    "        (1, 2),",
                    "        (3, 4)",
                    ") as tmp(a, b)"
                ].join("\n"),
                minify: "select from(values(1,2),(3,4))as tmp(a,b)"
            }
        });

        Sql.assertNode(Select, {
            input: "select from (values (1)) as tmp",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        values: [
                            {values: [
                                {value: {number: "1"}}
                            ]}
                        ],
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "from (",
                    "    values",
                    "        (1)",
                    ") as tmp"
                ].join("\n"),
                minify: "select from(values(1))as tmp"
            }
        });

        Sql.assertNode(Select, {
            input: "select from lateral (values (1)) as tmp",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        lateral: true,
                        values: [
                            {values: [
                                {value: {number: "1"}}
                            ]}
                        ],
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "from lateral (",
                    "    values",
                    "        (1)",
                    ") as tmp"
                ].join("\n"),
                minify: "select from lateral(values(1))as tmp"
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Select, {
            input: "select from (values (1))",
            throws: /subquery in FROM must have an alias/
        });

    });

});