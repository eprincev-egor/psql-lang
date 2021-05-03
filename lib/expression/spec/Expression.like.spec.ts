import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.like.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "company.name ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name not ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name not like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

    });

});