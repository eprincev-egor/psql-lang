import { Sql } from "../../Sql";
import { WindowItem } from "../WindowItem";

describe("WindowItem", () => {

    it("valid inputs", () => {

        Sql.assertNode(WindowItem, {
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