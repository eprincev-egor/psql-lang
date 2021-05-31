import { Sql } from "../../Sql";
import { LineComment } from "../LineComment";

describe("LineComment", () => {

    it("valid inputs", () => {

        Sql.assertNode(LineComment, {
            input: "--",
            shouldBe: {
                json: {inlineComment: ""}
            }
        });

        Sql.assertNode(LineComment, {
            input: "--hello",
            shouldBe: {
                json: {inlineComment: "hello"}
            }
        });

        Sql.assertNode(LineComment, {
            input: "--hello\n",
            shouldBe: {
                json: {inlineComment: "hello"},
                pretty: "--hello",
                minify: "--hello"
            }
        });

        Sql.assertNode(LineComment, {
            input: "--hello\r",
            shouldBe: {
                json: {inlineComment: "hello"},
                pretty: "--hello",
                minify: "--hello"
            }
        });

        Sql.assertNode(LineComment, {
            input: "----",
            shouldBe: {
                json: {inlineComment: "--"}
            }
        });

    });

});