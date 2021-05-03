import { assertNode } from "abstract-lang";
import { BooleanLiteral } from "../BooleanLiteral";

describe("BooleanLiteral", () => {

    it("valid inputs", () => {
        assertNode(BooleanLiteral, {
            input: "true",
            shouldBe: {
                json: {boolean: true}
            }
        });

        assertNode(BooleanLiteral, {
            input: "TRUE",
            shouldBe: {
                json: {boolean: true},
                pretty: "true",
                minify: "true"
            }
        });

        assertNode(BooleanLiteral, {
            input: "false",
            shouldBe: {
                json: {boolean: false}
            }
        });

        assertNode(BooleanLiteral, {
            input: "FALSE",
            shouldBe: {
                json: {boolean: false},
                pretty: "false",
                minify: "false"
            }
        });
    });

});