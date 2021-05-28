import { assertNode } from "abstract-lang";
import { LineComment } from "../LineComment";

describe("LineComment", () => {

    it("valid inputs", () => {

        assertNode(LineComment, {
            input: "--",
            shouldBe: {
                json: {inlineComment: ""}
            }
        });

        assertNode(LineComment, {
            input: "--hello",
            shouldBe: {
                json: {inlineComment: "hello"}
            }
        });

        assertNode(LineComment, {
            input: "--hello\n",
            shouldBe: {
                json: {inlineComment: "hello"},
                pretty: "--hello",
                minify: "--hello"
            }
        });

        assertNode(LineComment, {
            input: "--hello\r",
            shouldBe: {
                json: {inlineComment: "hello"},
                pretty: "--hello",
                minify: "--hello"
            }
        });

        assertNode(LineComment, {
            input: "----",
            shouldBe: {
                json: {inlineComment: "--"}
            }
        });

    });

});