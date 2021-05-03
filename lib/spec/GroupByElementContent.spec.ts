import { assertNode } from "abstract-lang";
import { GroupByElementContent } from "../GroupByElementContent";

describe("GroupByElementContent", () => {

    it("valid inputs", () => {

        assertNode(GroupByElementContent, {
            input: "id",
            shouldBe: {
                json: {expression: {
                    column: [
                        {name: "id"}
                    ]
                }}
            }
        });

        assertNode(GroupByElementContent, {
            input: "(id, name)",
            shouldBe: {
                json: {expressions: [
                    {column: [
                        {name: "id"}
                    ]},
                    {column: [
                        {name: "name"}
                    ]}
                ]},
                minify: "(id,name)"
            }
        });

    });

});