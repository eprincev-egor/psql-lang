import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

describe("Expression.cast.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

    });

});