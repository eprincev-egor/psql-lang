import { assertNode } from "abstract-lang";
import { WindowItem } from "../WindowItem";

describe("WindowItem", () => {

    it("valid inputs", () => {

        assertNode(WindowItem, {
            input: "hello as (bob)",
            shouldBe: {
                json: {
                    window: {
                        existingWindow: {name: "bob"}
                    },
                    as: {name: "hello"}
                },
                pretty: [
                    "hello as (",
                    "    bob",
                    ")"
                ].join("\n"),
                minify: "hello as(bob)"
            }
        });

    });

});