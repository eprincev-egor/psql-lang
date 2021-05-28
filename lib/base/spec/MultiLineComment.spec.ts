import { assertNode } from "abstract-lang";
import { MultilineComment } from "../MultilineComment";

describe("MultilineComment", () => {

    it("valid inputs", () => {

        assertNode(MultilineComment, {
            input: "/**/",
            shouldBe: {
                json: {multilineComment: ""}
            }
        });

        assertNode(MultilineComment, {
            input: "/*hello*/",
            shouldBe: {
                json: {multilineComment: "hello"}
            }
        });

        assertNode(MultilineComment, {
            input: "/*hello\nworld*/",
            shouldBe: {
                json: {multilineComment: "hello\nworld"}
            }
        });

        assertNode(MultilineComment, {
            input: "/*hello\rworld*/",
            shouldBe: {
                json: {multilineComment: "hello\rworld"}
            }
        });

    });

});