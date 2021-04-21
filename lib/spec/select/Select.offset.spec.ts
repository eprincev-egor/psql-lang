import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.offset.spec.ts: offset/limit/...", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select name from users limit 10",
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
                    limit: {operand: {
                        number: "10"
                    }}
                },
                pretty: "select\n    name\nfrom users\nlimit 10"
            }
        });

        assertNode(Select, {
            input: "select name from users limit all",
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
                pretty: "select\n    name\nfrom users",
                minify: "select name from users"
            }
        });

        assertNode(Select, {
            input: "select name from users offset 10",
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
                    offset: {operand: {
                        number: "10"
                    }}
                },
                pretty: "select\n    name\nfrom users\noffset 10"
            }
        });

    });

});