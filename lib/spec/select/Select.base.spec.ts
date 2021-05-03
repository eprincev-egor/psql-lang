import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.base.spec.ts: base select variants", () => {

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
                        expression: {number: "1"}
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
                        {expression: {number: "1"}},
                        {expression: {number: "2"}}
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
                        {expression: {
                            column: [{name: "name"}]
                        }}
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
            input: "select * from users",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [],
                            allColumns: true
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    *\nfrom users",
                minify: "select*from users"
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

    });

});