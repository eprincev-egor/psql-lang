import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.cast.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "cast( 'hello' as text )",
            shouldBe: {
                json: {
                    operand: {
                        cast: {string: "hello"},
                        as: {type: "text"}
                    }
                },
                pretty: "'hello'::text",
                minify: "'hello'::text"
            }
        });

        Sql.assertNode(Expression, {
            input: "8::numeric(14, 2)",
            shouldBe: {
                json: {
                    operand: {
                        cast: {number: "8"},
                        as: {type: "numeric(14, 2)"}
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
                        as: {type: "bigint"}
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
                        as: {type: "bigint"}
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
                            as: {type: "numeric"}
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