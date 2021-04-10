import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

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
                            {operand: {number: "1"}},
                            {operand: {number: "2"}}
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
                            {operand: {number: "3"}},
                            {operand: {number: "4"}},
                            {operand: {number: "5"}}
                        ]
                    }
                },
                minify: "orders.type not in(3,4,5)"
            }
        });

    });

});