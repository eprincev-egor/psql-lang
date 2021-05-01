import { assertNode } from "abstract-lang";
import { WithQuery } from "../WithQuery";

describe("WithQuery", () => {

    it("valid inputs", () => {

        assertNode(WithQuery, {
            input: `items as (
                select
            )`,
            shouldBe: {
                json: {
                    name: {name: "items"},
                    query: {
                        select: [],
                        from: []
                    }
                },
                pretty: [
                    "items as (",
                    "    select",
                    ")"
                ].join("\n"),
                minify: "items as(select)"
            }
        });

        assertNode(WithQuery, {
            input: `items as (
                select 1,2
            )`,
            shouldBe: {
                json: {
                    name: {name: "items"},
                    query: {
                        select: [
                            {
                                expression: {operand: {
                                    number: "1"
                                }}
                            },
                            {
                                expression: {operand: {
                                    number: "2"
                                }}
                            }
                        ],
                        from: []
                    }
                },
                pretty: [
                    "items as (",
                    "    select",
                    "        1,",
                    "        2",
                    ")"
                ].join("\n"),
                minify: "items as(select 1,2)"
            }
        });

        assertNode(WithQuery, {
            input: `items as (
                values
                    (1, 2),
                    (3, 4)
            )`,
            shouldBe: {
                json: {
                    name: {name: "items"},
                    values: [
                        {values: [
                            {value: {operand: {
                                number: "1"
                            }}},
                            {value: {operand: {
                                number: "2"
                            }}}
                        ]},
                        {values: [
                            {value: {operand: {
                                number: "3"
                            }}},
                            {value: {operand: {
                                number: "4"
                            }}}
                        ]}
                    ]
                },
                pretty: [
                    "items as (",
                    "    values",
                    "        (1, 2),",
                    "        (3, 4)",
                    ")"
                ].join("\n"),
                minify: "items as(values(1,2),(3,4))"
            }
        });

        assertNode(WithQuery, {
            input: `items (id, code) as (
                values
                    (1, 2),
                    (3, 4)
            )`,
            shouldBe: {
                json: {
                    name: {name: "items"},
                    columns: [
                        {name: "id"},
                        {name: "code"}
                    ],
                    values: [
                        {values: [
                            {value: {operand: {
                                number: "1"
                            }}},
                            {value: {operand: {
                                number: "2"
                            }}}
                        ]},
                        {values: [
                            {value: {operand: {
                                number: "3"
                            }}},
                            {value: {operand: {
                                number: "4"
                            }}}
                        ]}
                    ]
                },
                pretty: [
                    "items (id, code) as (",
                    "    values",
                    "        (1, 2),",
                    "        (3, 4)",
                    ")"
                ].join("\n"),
                minify: "items(id,code)as(values(1,2),(3,4))"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(WithQuery, {
            input: `items as (
                values
                    (1, 2, 3),
                    (4, 5)
            )`,
            throws: /VALUES lists must all be the same length/,
            target: "(4, 5)"
        });

        assertNode(WithQuery, {
            input: `items as (
                values
                    (1, 2, 3),
                    (4, 5, default)
            )`,
            throws: /DEFAULT is not allowed in this context/,
            target: "default"
        });

    });

});