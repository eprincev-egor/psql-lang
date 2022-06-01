import { Sql } from "../../Sql";
import { MultilineComment } from "../MultilineComment";

describe("MultilineComment", () => {

    it("valid inputs", () => {

        Sql.assertNode(MultilineComment, {
            input: "/**/",
            shouldBe: {
                json: {multilineComment: ""}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*hello*/",
            shouldBe: {
                json: {multilineComment: "hello"}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*hello\nworld*/",
            shouldBe: {
                json: {multilineComment: "hello\nworld"}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*hello\rworld*/",
            shouldBe: {
                json: {multilineComment: "hello\rworld"}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*/*hello\rworld*/*/",
            shouldBe: {
                json: {multilineComment: "/*hello\rworld*/"}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*/*hello*/\n-- world\n*/",
            shouldBe: {
                json: {multilineComment: "/*hello*/\n-- world\n"}
            }
        });

        Sql.assertNode(MultilineComment, {
            input: "/*/*hello*/\n+3\n*/",
            shouldBe: {
                json: {multilineComment: "/*hello*/\n+3\n"}
            }
        });

    });

});