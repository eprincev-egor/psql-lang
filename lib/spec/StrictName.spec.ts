import { assertNode } from "abstract-lang";
import assert from "assert";
import { StrictName } from "../StrictName";

describe("StrictName", () => {

    it("valid inputs", () => {

        assertNode(StrictName, {
            input: "\"\"",
            shouldBe: {
                json: {
                    strictName: ""
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "");
                }
            }
        });

        assertNode(StrictName, {
            input: "\"HELLO\"",
            shouldBe: {
                json: {
                    strictName: "HELLO"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "HELLO");
                }
            }
        });

        assertNode(StrictName, {
            input: "\"hello world\"",
            shouldBe: {
                json: {
                    strictName: "hello world"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "hello world");
                }
            }
        });

        assertNode(StrictName, {
            input: "\"HELLO \"\"world\"\"\"",
            shouldBe: {
                json: {
                    strictName: "HELLO \"\"world\"\""
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "HELLO \"world\"");
                }
            }
        });

        assertNode(StrictName, {
            input: "U&\"d\\0061t\\+000061 hello\"",
            shouldBe: {
                json: {
                    strictName: "d\\0061t\\+000061 hello",
                    unicodeEscape: "\\"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data hello");
                }
            }
        });

        assertNode(StrictName, {
            input: "U&\"d\\0061t\\+000061 world\" uescape '\\'",
            shouldBe: {
                json: {
                    strictName: "d\\0061t\\+000061 world",
                    unicodeEscape: "\\"
                },
                pretty: "U&\"d\\0061t\\+000061 world\"",
                minify: "U&\"d\\0061t\\+000061 world\"",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data world");
                }
            }
        });

        assertNode(StrictName, {
            input: "u&\"d\\0061t\\+000061 test\"",
            shouldBe: {
                json: {
                    strictName: "d\\0061t\\+000061 test",
                    unicodeEscape: "\\"
                },
                pretty: "U&\"d\\0061t\\+000061 test\"",
                minify: "U&\"d\\0061t\\+000061 test\"",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data test");
                }
            }
        });

        assertNode(StrictName, {
            input: "U&\"d!0061t!+000061\" UESCAPE '!'",
            shouldBe: {
                json: {
                    strictName: "d!0061t!+000061",
                    unicodeEscape: "!"
                },

                pretty: "U&\"d!0061t!+000061\" uescape '!'",
                minify: "U&\"d!0061t!+000061\" uescape '!'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data");
                }
            }
        });

        assertNode(StrictName, {
            input: "U&\"\\0066\"",
            shouldBe: {
                json: {
                    strictName: "\\0066",
                    unicodeEscape: "\\"
                },
                parsed(node) {
                    assert.strictEqual(node.toValue(), "f");
                }
            }
        });

    });

    it("invalid inputs", () => {
        assertNode(StrictName, {
            input: "\"1\" uescape",
            throws: /unexpected uescape, use u& before quotes/
        });

        assertNode(StrictName, {
            input: "U&\"d!0061t!+000061\" UESCAPE '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/
        });

        assertNode(StrictName, {
            input: "u&\"\" uescape '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/
        });

        assertNode(StrictName, {
            input: "U&\"\\0000\"",
            shouldBe: {
                json: {
                    strictName: "\\0000",
                    unicodeEscape: "\\"
                },
                parsed(node) {
                    assert.throws(() => {
                        node.toValue();
                    }, (err: Error) =>
                        /invalid input unicode: 0{4}/.test(err.message)
                    );
                }
            }
        });

    });

});
