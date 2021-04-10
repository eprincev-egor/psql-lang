import { assertNode } from "abstract-lang";
import assert from "assert";
import { StringLiteral } from "../StringLiteral";

describe("StringLiteral", () => {

    it("valid inputs", () => {

        assertNode(StringLiteral, {
            input: "''",
            shouldBe: {
                json: {
                    string: ""
                }
            }
        });

        assertNode(StringLiteral, {
            input: "'hello'",
            shouldBe: {
                json: {
                    string: "hello"
                }
            }
        });

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
            input: "'first line'\n' second line'",
            shouldBe: {
                json: {
                    string: "first line second line"
                },
                pretty: "'first line second line'",
                minify: "'first line second line'"
            }
        });

        assertNode(StringLiteral, {
            input: "'first '\r' second'",
            shouldBe: {
                json: {
                    string: "first  second"
                },
                pretty: "'first  second'",
                minify: "'first  second'"
            }
        });

        assertNode(StringLiteral, {
            input: "'hello' \n\r 'world' \n\r 'world'",
            shouldBe: {
                json: {
                    string: "helloworldworld"
                },
                pretty: "'helloworldworld'",
                minify: "'helloworldworld'"
            }
        });

        assertNode(StringLiteral, {
            input: "'hello' \n\r ",
            shouldBe: {
                json: {
                    string: "hello"
                },
                pretty: "'hello'",
                minify: "'hello'"
            }
        });

        assertNode(StringLiteral, {
            input: "'_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'",
            shouldBe: {
                json: {
                    string: "_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789"
                }
            }
        });

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
            input: "E'\\n10'",
            shouldBe: {
                json: {
                    string: "\\n10",
                    escape: true
                }
            }
        });

        assertNode(StringLiteral, {
            input: "E'\\none'",
            shouldBe: {
                json: {
                    string: "\\none",
                    escape: true
                }
            }
        });

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
            input: "'1\n\r2'",
            shouldBe: {
                json: {
                    string: "1\n\r2"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "E'_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'",
            shouldBe: {
                json: {
                    string: "_ \"!@#$%^&*()-+*/=№?[]{}<>|    ~`.:;,qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789",
                    escape: true
                }
            }
        });

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
            input: "$$hello$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: "hello"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$$$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: ""
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$tag$hello$tag$",
            shouldBe: {
                json: {
                    tag: "tag",
                    string: "hello"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$tag$$tag$",
            shouldBe: {
                json: {
                    tag: "tag",
                    string: ""
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$TAG$he$$llo$TAG$",
            shouldBe: {
                json: {
                    tag: "TAG",
                    string: "he$$llo"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$Tag_1$$tag_1$$Tag_1$",
            shouldBe: {
                json: {
                    tag: "Tag_1",
                    string: "$tag_1$"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$$\n\r$$",
            shouldBe: {
                json: {
                    tag: "",
                    string: "\n\r"
                }
            }
        });

        assertNode(StringLiteral, {
            input: "$q$[\\t\\r\\n\\v\\\\]$q$",
            shouldBe: {
                json: {
                    tag: "q",
                    string: "[\\t\\r\\n\\v\\\\]"
                }
            }
        });

        assertNode(StringLiteral, {
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
        assertNode(StringLiteral, {
            input: "'1' uescape",
            throws: /unexpected uescape, use u& before quotes/,
            target: "uescape"
        });

        assertNode(StringLiteral, {
            input: "E'1' uescape",
            throws: /unexpected uescape, use u& before quotes/,
            target: "uescape"
        });

        assertNode(StringLiteral, {
            input: "U&'d!0061t!+000061' UESCAPE '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        assertNode(StringLiteral, {
            input: "u&'' uescape '+'",
            throws: /The escape character can be any single character other than a hexadecimal digit, the plus sign, a single quote, a double quote, or a whitespace character/,
            target: "+"
        });

        assertNode(StringLiteral, {
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

        assertNode(StringLiteral, {
            input: "$0x$xx$0x$",
            throws: /dollar tag should starts with alphabet char, invalid tag: 0x/,
            target: "0"
        });

        assertNode(StringLiteral, {
            input: "$x*$xx$x*$",
            throws: /unexpected token: "\*", expected: "\$"/,
            target: "*"
        });

    });

});
