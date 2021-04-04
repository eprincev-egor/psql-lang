import { assertNode } from "abstract-lang";
import { ByteStringLiteral } from "../ByteStringLiteral";

describe("ByteStringLiteral", () => {

    it("valid inputs", () => {

        assertNode(ByteStringLiteral, {
            input: "B'0011'",
            shouldBe: {
                json: {
                    base: "binary",
                    byteString: "0011"
                }
            }
        });

        assertNode(ByteStringLiteral, {
            input: "b'1'",
            shouldBe: {
                json: {
                    base: "binary",
                    byteString: "1"
                },
                pretty: "B'1'",
                minify: "B'1'"
            }
        });

        assertNode(ByteStringLiteral, {
            input: "B''",
            shouldBe: {
                json: {
                    base: "binary",
                    byteString: ""
                }
            }
        });

        assertNode(ByteStringLiteral, {
            input: "X'0123ee'",
            shouldBe: {
                json: {
                    base: "hexadecimal",
                    byteString: "0123ee"
                }
            }
        });

        assertNode(ByteStringLiteral, {
            input: "x'ff'",
            shouldBe: {
                json: {
                    base: "hexadecimal",
                    byteString: "ff"
                },
                pretty: "X'ff'",
                minify: "X'ff'"
            }
        });

        assertNode(ByteStringLiteral, {
            input: "x'FFa'",
            shouldBe: {
                json: {
                    base: "hexadecimal",
                    byteString: "ffa"
                },
                pretty: "X'ffa'",
                minify: "X'ffa'"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(ByteStringLiteral, {
            input: "x'zz'",
            throws: /"z" is not a valid hexadecimal digit/
        });

        assertNode(ByteStringLiteral, {
            input: "b'zz'",
            throws: /"z" is not a valid binary digit/
        });

        assertNode(ByteStringLiteral, {
            input: "b'a'",
            throws: /"a" is not a valid binary digit/
        });

        assertNode(ByteStringLiteral, {
            input: "b'2'",
            throws: /"2" is not a valid binary digit/
        });

    });

});