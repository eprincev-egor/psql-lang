import { assertNode } from "abstract-lang";
import { WindowDefinitionFrameElement } from "../WindowDefinitionFrameElement";

describe("WindowDefinitionFrameElement", () => {

    it("valid inputs", () => {

        assertNode(WindowDefinitionFrameElement, {
            input: "current row",
            shouldBe: {
                json: {
                    type: "currentRow"
                }
            }
        });

        assertNode(WindowDefinitionFrameElement, {
            input: "CURRENT row",
            shouldBe: {
                json: {
                    type: "currentRow"
                },
                pretty: "current row",
                minify: "current row"
            }
        });

        assertNode(WindowDefinitionFrameElement, {
            input: "Unbounded Following",
            shouldBe: {
                json: {
                    type: "following",
                    value: "unbounded"
                },
                pretty: "unbounded following",
                minify: "unbounded following"
            }
        });

        assertNode(WindowDefinitionFrameElement, {
            input: "2 preceding",
            shouldBe: {
                json: {
                    type: "preceding",
                    value: {number: "2"}
                }
            }
        });

    });

});