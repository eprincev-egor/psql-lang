import assert from "assert";
import { Sql } from "../../Sql";
import { Name } from "../Name";

describe("Name", () => {

    it("valid inputs", () => {

        Sql.assertNode(Name, {
            input: "name",
            shouldBe: {
                json: {name: "name"},

                parsed(node) {
                    assert.strictEqual(node.toValue(), "name");
                }
            }
        });

        Sql.assertNode(Name, {
            input: "hello",
            shouldBe: {
                json: {name: "hello"}
            }
        });

        Sql.assertNode(Name, {
            input: "HELLO",
            shouldBe: {
                json: {name: "hello"},
                pretty: "hello",
                minify: "hello",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "hello");
                }
            }
        });

        Sql.assertNode(Name, {
            input: "__",
            shouldBe: {
                json: {name: "__"}
            }
        });

        Sql.assertNode(Name, {
            input: "a1",
            shouldBe: {
                json: {name: "a1"}
            }
        });

        Sql.assertNode(Name, {
            input: "XYZ1ABC ",
            shouldBe: {
                json: {name: "xyz1abc"},
                pretty: "xyz1abc",
                minify: "xyz1abc"
            }
        });

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
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

        Sql.assertNode(Name, {
            input: "0a",
            throws: /name should starts with alphabet char, invalid name: 0a/,
            target: "0"
        });

        Sql.assertNode(Name, {
            input: "\"1\" uescape",
            throws: /unexpected uescape, use u& before quotes/,
            target: "uescape"
        });

        Sql.assertNode(Name, {
            input: "U&\"d!0061t!+000061\" UESCAPE '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        Sql.assertNode(Name, {
            input: "u&\"\" uescape '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        Sql.assertNode(Name, {
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