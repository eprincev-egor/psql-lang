import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "1 + 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "+",
                        right: {number: "2"}
                    }
                },
                minify: "1+2"
            }
        });

        assertNode(Expression, {
            input: "'hello' || 'world'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "hello"},
                        operator: "||",
                        right: {string: "world"}
                    }
                },
                minify: "'hello'||'world'"
            }
        });

        assertNode(Expression, {
            input: "true > false",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: ">",
                        right: {boolean: false}
                    }
                },
                minify: "true>false"
            }
        });

        assertNode(Expression, {
            input: "true > null",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: ">",
                        right: {null: true}
                    }
                },
                minify: "true>null"
            }
        });

        assertNode(Expression, {
            input: "$variable = 4",
            shouldBe: {
                json: {
                    operand: {
                        left: {variable: "variable"},
                        operator: "=",
                        right: {number: "4"}
                    }
                },
                minify: "$variable=4"
            }
        });

        assertNode(Expression, {
            input: "$t$20 days$t$ >= interval '1 day'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "20 days", tag: "t"},
                        operator: ">=",
                        right: {interval: {string: "1 day"}}
                    }
                },
                minify: "$t$20 days$t$>=interval '1 day'"
            }
        });

        assertNode(Expression, {
            input: "company.dt_create <= interval '1 year'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "dt_create"}
                        ]},
                        operator: "<=",
                        right: {interval: {string: "1 year"}}
                    }
                },
                minify: "company.dt_create<=interval '1 year'"
            }
        });

        assertNode(Expression, {
            input: "b'0001' || x'0ffe'",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            base: "binary",
                            byteString: "0001"
                        },
                        operator: "||",
                        right: {
                            base: "hexadecimal",
                            byteString: "0ffe"
                        }
                    }
                },
                pretty: "B'0001' || X'0ffe'",
                minify: "B'0001'||X'0ffe'"
            }
        });

        assertNode(Expression, {
            input: "E'hello' || U&'world'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "hello", escape: true},
                        operator: "||",
                        right: {string: "world", unicodeEscape: "\\"}
                    }
                },
                minify: "E'hello'||U&'world'"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Expression, {
            input: "::",
            throws: /expected expression operand/
        });

    });

});