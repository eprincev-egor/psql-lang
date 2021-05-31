import assert from "assert";
import { Sql } from "../../../Sql";
import { StringLiteral } from "../StringLiteral";

describe("StringLiteral", () => {

    it("valid inputs", () => {

        Sql.assertNode(StringLiteral, {
            input: "''",
            shouldBe: {
                json: {
                    string: ""
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'hello'",
            shouldBe: {
                json: {
                    string: "hello"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'hello ''world'''",
            shouldBe: {
                json: {
                    string: "hello ''world''"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "hello 'world'");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'first line'\n' second line'",
            shouldBe: {
                json: {
                    string: "first line second line"
                },
                pretty: "'first line second line'",
                minify: "'first line second line'"
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'first '\r' second'",
            shouldBe: {
                json: {
                    string: "first  second"
                },
                pretty: "'first  second'",
                minify: "'first  second'"
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'hello' \n\r 'world' \n\r 'world'",
            shouldBe: {
                json: {
                    string: "helloworldworld"
                },
                pretty: "'helloworldworld'",
                minify: "'helloworldworld'"
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'hello' \n\r ",
            shouldBe: {
                json: {
                    string: "hello"
                },
                pretty: "'hello'",
                minify: "'hello'"
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'",
            shouldBe: {
                json: {
                    string: "_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "U&'d\\0061t\\+000061 hello'",
            shouldBe: {
                json: {
                    string: "d\\0061t\\+000061 hello",
                    unicodeEscape: "\\"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data hello");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "U&'d\\0061t\\+000061 world' uescape '\\'",
            shouldBe: {
                json: {
                    string: "d\\0061t\\+000061 world",
                    unicodeEscape: "\\"
                },
                pretty: "U&'d\\0061t\\+000061 world'",
                minify: "U&'d\\0061t\\+000061 world'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data world");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "u&'d\\0061t\\+000061 test'",
            shouldBe: {
                json: {
                    string: "d\\0061t\\+000061 test",
                    unicodeEscape: "\\"
                },
                pretty: "U&'d\\0061t\\+000061 test'",
                minify: "U&'d\\0061t\\+000061 test'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data test");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "U&'d!0061t!+000061' UESCAPE '!'",
            shouldBe: {
                json: {
                    string: "d!0061t!+000061",
                    unicodeEscape: "!"
                },

                pretty: "U&'d!0061t!+000061' uescape '!'",
                minify: "U&'d!0061t!+000061' uescape '!'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "data");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "U&'\\0066'",
            shouldBe: {
                json: {
                    string: "\\0066",
                    unicodeEscape: "\\"
                },
                parsed(node) {
                    assert.strictEqual(node.toValue(), "f");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'hello'",
            shouldBe: {
                json: {
                    string: "hello",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "hello");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\\\'",
            shouldBe: {
                json: {
                    string: "\\\\",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\\");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "e'\\\\test'",
            shouldBe: {
                json: {
                    string: "\\\\test",
                    escape: true
                },
                pretty: "E'\\\\test'",
                minify: "E'\\\\test'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\\test");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'\\\\'",
            shouldBe: {
                json: {
                    string: "\\\\"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\\\\");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "e'\\n'",
            shouldBe: {
                json: {
                    string: "\\n",
                    escape: true
                },
                pretty: "E'\\n'",
                minify: "E'\\n'",

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\n");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\r'",
            shouldBe: {
                json: {
                    string: "\\r",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\r");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E''''",
            shouldBe: {
                json: {
                    string: "''",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "'");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "U&''''",
            shouldBe: {
                json: {
                    string: "''",
                    unicodeEscape: "\\"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "'");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'e\\''''",
            shouldBe: {
                json: {
                    string: "e\\'''",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "e''");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\n10'",
            shouldBe: {
                json: {
                    string: "\\n10",
                    escape: true
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\none'",
            shouldBe: {
                json: {
                    string: "\\none",
                    escape: true
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\b'",
            shouldBe: {
                json: {
                    string: "\\b",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\b");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\f'",
            shouldBe: {
                json: {
                    string: "\\f",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\f");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\t'",
            shouldBe: {
                json: {
                    string: "\\t",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\t");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "'1\n\r2'",
            shouldBe: {
                json: {
                    string: "1\n\r2"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'",
            shouldBe: {
                json: {
                    string: "_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789",
                    escape: true
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\U00000061b'",
            shouldBe: {
                json: {
                    string: "\\U00000061b",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "ab");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\U00000061_\\U00000062'",
            shouldBe: {
                json: {
                    string: "\\U00000061_\\U00000062",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "a_b");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\u006aa'",
            shouldBe: {
                json: {
                    string: "\\u006aa",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "ja");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\x7a\\x79'",
            shouldBe: {
                json: {
                    string: "\\x7a\\x79",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "zy");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\x7\\xf'",
            shouldBe: {
                json: {
                    string: "\\x7\\xf",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "\u{0007}\u{000F}");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\111\\112'",
            shouldBe: {
                json: {
                    string: "\\111\\112",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "IJ");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\77'",
            shouldBe: {
                json: {
                    string: "\\77",
                    escape: true
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "?");
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$$hello$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: "hello"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$$$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: ""
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$tag$hello$tag$",
            shouldBe: {
                json: {
                    tag: "tag",
                    string: "hello"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$tag$$tag$",
            shouldBe: {
                json: {
                    tag: "tag",
                    string: ""
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$TAG$he$$llo$TAG$",
            shouldBe: {
                json: {
                    tag: "TAG",
                    string: "he$$llo"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$Tag_1$$tag_1$$Tag_1$",
            shouldBe: {
                json: {
                    tag: "Tag_1",
                    string: "$tag_1$"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$$\n\r$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: "\n\r"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$q$[\\t\\r\\n\\v\\\\]$q$",
            shouldBe: {
                json: {
                    tag: "q",
                    string: "[\\t\\r\\n\\v\\\\]"
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$$''\\$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: "''\\"
                },

                parsed(node) {
                    assert.strictEqual(node.toValue(), "''\\");
                }
            }
        });

    });

    it("invalid inputs", () => {
        Sql.assertNode(StringLiteral, {
            input: "'1' uescape",
            throws: /unexpected uescape, use u& before quotes/,
            target: "uescape"
        });

        Sql.assertNode(StringLiteral, {
            input: "E'1' uescape",
            throws: /unexpected uescape, use u& before quotes/,
            target: "uescape"
        });

        Sql.assertNode(StringLiteral, {
            input: "U&'d!0061t!+000061' UESCAPE '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        Sql.assertNode(StringLiteral, {
            input: "u&'' uescape '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        Sql.assertNode(StringLiteral, {
            input: "E'\\x00'",
            shouldBe: {
                json: {
                    string: "\\x00",
                    escape: true
                },
                parsed(node) {
                    assert.throws(() => {
                        node.toValue();
                    }, (err: Error) =>
                        /invalid input unicode: 00/.test(err.message)
                    );
                }
            }
        });

        Sql.assertNode(StringLiteral, {
            input: "$0x$xx$0x$",
            throws: /dollar tag should starts with alphabet char, invalid tag: 0x/,
            target: "0"
        });

        Sql.assertNode(StringLiteral, {
            input: "$x*$xx$x*$",
            throws: /unexpected token: "\*", expected: "\$"/,
            target: "*"
        });

    });

});
