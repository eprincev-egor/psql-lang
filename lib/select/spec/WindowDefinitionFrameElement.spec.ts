import { Sql } from "../../Sql";
import { WindowDefinitionFrameElement } from "../WindowDefinitionFrameElement";

describe("WindowDefinitionFrameElement", () => {

    it("valid inputs", () => {

        Sql.assertNode(WindowDefinitionFrameElement, {
            input: "current row",
            shouldBe: {
                json: {
                    type: "currentRow"
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrameElement, {
            input: "CURRENT row",
            shouldBe: {
                json: {
                    type: "currentRow"
                },
                pretty: "current row",
                minify: "current row"
            }
        });

        Sql.assertNode(WindowDefinitionFrameElement, {
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

        Sql.assertNode(WindowDefinitionFrameElement, {
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