import { assertNode } from "abstract-lang";
import { Select } from "../Select";

describe("Select", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select",
            shouldBe: {
                json: {
                    select: [],
                    from: []
                }
            }
        });

        assertNode(Select, {
            input: "select 1",
            shouldBe: {
                json: {
                    select: [{
                        expression: {operand: {number: "1"}}
                    }],
                    from: []
                },
                pretty: "select\n    1"
            }
        });

        assertNode(Select, {
            input: "select 1, 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            number: "1"
                        }}},
                        {expression: {operand: {
                            number: "2"
                        }}}
                    ],
                    from: []
                },
                pretty: "select\n    1,\n    2",
                minify: "select 1,2"
            }
        });

        assertNode(Select, {
            input: "select name from users",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    name\nfrom users"
            }
        });

        assertNode(Select, {
            input: "select from users, companies",
            shouldBe: {
                json: {
                    select: [],
                    from: [
                        {table: {
                            name: {name: "users"}
                        }},
                        {table: {
                            name: {name: "companies"}
                        }}
                    ]
                },
                pretty: "select\nfrom users, companies",
                minify: "select from users,companies"
            }
        });

        assertNode(Select, {
            input: "select name from users where users.name is not null",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    where: {operand: {
                        operand: {column: [
                            {name: "users"},
                            {name: "name"}
                        ]},
                        postOperator: "is not null"
                    }}
                },
                pretty: [
                    "select",
                    "    name",
                    "from users",
                    "where",
                    "    users.name is not null"
                ].join("\n")
            }
        });

        assertNode(Select, {
            input: "select 1 where false",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            number: "1"
                        }}}
                    ],
                    from: [],
                    where: {operand: {
                        boolean: false
                    }}
                },
                pretty: [
                    "select",
                    "    1",
                    "where",
                    "    false"
                ].join("\n")
            }
        });

    });

});