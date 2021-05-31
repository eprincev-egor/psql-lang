import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.position.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
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

        Sql.assertNode(Expression, {
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