import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.in.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "orders.type in (1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        in: [
                            {number: "1"},
                            {number: "2"}
                        ]
                    }
                },
                minify: "orders.type in(1,2)"
            }
        });

        assertNode(Expression, {
            input: "orders.type not in (3, 4, 5)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        notIn: [
                            {number: "3"},
                            {number: "4"},
                            {number: "5"}
                        ]
                    }
                },
                minify: "orders.type not in(3,4,5)"
            }
        });

    });

});