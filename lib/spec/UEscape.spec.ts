import { assertNode } from "abstract-lang";
import { UEscape } from "../UEscape";

describe("UEscape", () => {

    it("valid inputs", () => {
        assertNode(UEscape, {
            input: "uescape '!'",
            shouldBe: {
                json: {escape: "!"}
            }
        });
    });

});