import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.equalAny.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "2 = any(company.roles_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "2"},
                        equalAny: {
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
                            equalAny: {
                                array: [
                                    {number: "2"},
                                    {number: "1"}
                                ]
                            }
                        },
                        equalAny: {
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
                        equalSome: {
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

        assertNode(Expression, {
            input: "unit.id = all(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        equalAll: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id=all(orders.units_ids)"
            }
        });

    });

});