import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.arrayQuery.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "array(select id from companies where id = 1)",
            shouldBe: {
                json: {
                    operand: {
                        array: {
                            select: [
                                {expression: {
                                    column: [{
                                        name: "id"
                                    }]
                                }}
                            ],
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
                    "array(",
                    "    select",
                    "        id",
                    "    from companies",
                    "    where",
                    "        id = 1",
                    ")"
                ].join("\n"),
                minify: "array(select id from companies where id=1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "array(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        array: {
                            select: [
                                {expression: {number: "1"}}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "array(",
                    "    select",
                    "        1",
                    ")"
                ].join("\n")
            }
        });

    });

});