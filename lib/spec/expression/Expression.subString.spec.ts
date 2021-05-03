import { assertNode } from "abstract-lang";
import { Expression } from "../../Expression";

describe("Expression.subString.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "substring(test from 2)",
            shouldBe: {
                json: {
                    operand: {
                        subString: {column: [
                            {name: "test"}
                        ]},
                        from: {number: "2"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "substring(test, 2)",
            shouldBe: {
                json: {
                    operand: {
                        subString: {column: [
                            {name: "test"}
                        ]},
                        from: {number: "2"}
                    }
                },
                pretty: "substring(test from 2)",
                minify: "substring(test from 2)"
            }
        });

        assertNode(Expression, {
            input: "substring(test from 2 for 3)",
            shouldBe: {
                json: {
                    operand: {
                        subString: {column: [
                            {name: "test"}
                        ]},
                        from: {number: "2"},
                        for: {number: "3"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "substring(test, 2, 3)",
            shouldBe: {
                json: {
                    operand: {
                        subString: {column: [
                            {name: "test"}
                        ]},
                        from: {number: "2"},
                        for: {number: "3"}
                    }
                },
                pretty: "substring(test from 2 for 3)",
                minify: "substring(test from 2 for 3)"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Expression, {
            input: "substring(test)",
            throws: /required 'from' position/
        });

    });

});