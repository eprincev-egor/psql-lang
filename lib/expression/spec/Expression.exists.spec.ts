import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.exists.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "exists(select)",
            shouldBe: {
                json: {
                    operand: {
                        exists: {
                            select: [],
                            from: []
                        }
                    }
                },
                pretty: [
                    "exists(",
                    "    select",
                    ")"
                ].join("\n")
            }
        });

        Sql.assertNode(Expression, {
            input: "exists(select from companies where id = 1)",
            shouldBe: {
                json: {
                    operand: {
                        exists: {
                            select: [],
                            from: [{
                                table: {
                                    name: {name: "companies"}
                                }
                            }],
                            where: {
                                left: {column: [
                                    {name: "id"}
                                ]},
                                operator: "=",
                                right: {number: "1"}
                            }
                        }
                    }
                },
                pretty: [
                    "exists(",
                    "    select",
                    "    from companies",
                    "    where",
                    "        id = 1",
                    ")"
                ].join("\n"),
                minify: "exists(select from companies where id=1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "exists(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        exists: {
                            select: [
                                {expression: {number: "1"}}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "exists(",
                    "    select",
                    "        1",
                    ")"
                ].join("\n")
            }
        });

    });

});