import { assertNode } from "abstract-lang";
import { NullLiteral } from "../NullLiteral";

describe("NullLiteral", () => {

    it("valid inputs", () => {

        assertNode(NullLiteral, {
            input: "null",
            shouldBe: {
                json: {null: true}
            }
        });

        assertNode(NullLiteral, {
            input: "NULL",
            shouldBe: {
                json: {null: true},
                pretty: "null",
                minify: "null"
            }
        });

    });

});