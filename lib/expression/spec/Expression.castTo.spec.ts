import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.castTo.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "8::numeric(14, 2)",
            shouldBe: {
                json: {
                    operand: {
                        cast: {number: "8"},
                        to: {type: "numeric(14, 2)"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "2000 :: bigint",
            shouldBe: {
                json: {
                    operand: {
                        cast: {number: "2000"},
                        to: {type: "bigint"}
                    }
                },
                pretty: "2000::bigint",
                minify: "2000::bigint"
            }
        });

        Sql.assertNode(Expression, {
            input: "round(1.5)::bigint",
            shouldBe: {
                json: {
                    operand: {
                        cast: {
                            call: {
                                name: {name: "round"}
                            },
                            arguments: [{number: "1.5"}]
                        },
                        to: {type: "bigint"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "1::numeric / 10",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            cast: {number: "1"},
                            to: {type: "numeric"}
                        },
                        operator: "/",
                        right: {number: "10"}
                    }
                },
                minify: "1::numeric/10"
            }
        });

    });

});