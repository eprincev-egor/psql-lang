import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

describe("Expression.position.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "position('test' in 'test test')",
            shouldBe: {
                json: {
                    operand: {
                        position: {string: "test"},
                        in: {string: "test test"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "position('test' in ('test test'))",
            shouldBe: {
                json: {
                    operand: {
                        position: {string: "test"},
                        in: {
                            subExpression: {string: "test test"}
                        }
                    }
                },
                minify: "position('test' in('test test'))"
            }
        });

    });

});