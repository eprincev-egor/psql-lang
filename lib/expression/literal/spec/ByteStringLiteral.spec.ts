import { Sql } from "../../../Sql";
import { ByteStringLiteral } from "../ByteStringLiteral";

describe("ByteStringLiteral", () => {

    it("valid inputs", () => {

        Sql.assertNode(ByteStringLiteral, {
            input: "B'0011'",
            shouldBe: {
                json: {
                    base: "binary",
                    byteString: "0011"
                }
            }
        });

        Sql.assertNode(ByteStringLiteral, {
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

        Sql.assertNode(ByteStringLiteral, {
            input: "B''",
            shouldBe: {
                json: {
                    base: "binary",
                    byteString: ""
                }
            }
        });

        Sql.assertNode(ByteStringLiteral, {
            input: "X'0123ee'",
            shouldBe: {
                json: {
                    base: "hexadecimal",
                    byteString: "0123ee"
                }
            }
        });

        Sql.assertNode(ByteStringLiteral, {
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

        Sql.assertNode(ByteStringLiteral, {
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

        Sql.assertNode(ByteStringLiteral, {
            input: "x'zz'",
            throws: /"z" is not a valid hexadecimal digit/,
            target: "zz"
        });

        Sql.assertNode(ByteStringLiteral, {
            input: "b'zz'",
            throws: /"z" is not a valid binary digit/,
            target: "zz"
        });

        Sql.assertNode(ByteStringLiteral, {
            input: "b'a'",
            throws: /"a" is not a valid binary digit/,
            target: "a"
        });

        Sql.assertNode(ByteStringLiteral, {
            input: "b'2'",
            throws: /"2" is not a valid binary digit/,
            target: "2"
        });

    });

});