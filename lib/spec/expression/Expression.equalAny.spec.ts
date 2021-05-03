import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

describe("Expression.equalAny.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "2 = any(company.roles_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "2"},
                        anyArray: {
                            column: [
                                {name: "company"},
                                {name: "roles_ids"}
                            ]
                        }
                    }
                },
                minify: "2=any(company.roles_ids)"
            }
        });

        assertNode(Expression, {
            input: "3 = any(array[2, 1]) = any(array[false])",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            operand: {number: "3"},
                            anyArray: {
                                array: [
                                    {number: "2"},
                                    {number: "1"}
                                ]
                            }
                        },
                        anyArray: {
                            array: [
                                {boolean: false}
                            ]
                        }
                    }
                },
                minify: "3=any(array[2,1])=any(array[false])"
            }
        });

        assertNode(Expression, {
            input: "unit.id = some(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        someArray: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id=some(orders.units_ids)"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Expression, {
            input: "2 = any()",
            throws: /expected array argument/,
            target: "any()"
        });

        assertNode(Expression, {
            input: "2 = any(array[1], array[2])",
            throws: /expected only one argument/,
            target: "any(array[1], array[2])"
        });

        assertNode(Expression, {
            input: "2 = some(array[1], array[2])",
            throws: /expected only one argument/,
            target: "some(array[1], array[2])"
        });

    });

});