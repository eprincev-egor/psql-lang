import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.with.spec.ts: with ... select", () => {

    it("valid inputs", () => {

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