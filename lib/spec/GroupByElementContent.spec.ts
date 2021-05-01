import { assertNode } from "abstract-lang";
import { GroupByElementContent } from "../GroupByElementContent";

describe("GroupByElementContent", () => {

    it("valid inputs", () => {

        assertNode(GroupByElementContent, {
            input: "id",
            shouldBe: {
                json: {expression: {operand: {
                    column: [
                        {name: "id"}
                    ]
                }}}
            }
        });

        assertNode(GroupByElementContent, {
            input: "(id, name)",
            shouldBe: {
                json: {expressions: [
                    {operand: {
                        column: [
                            {name: "id"}
                        ]
                    }},
                    {operand: {
                        column: [
                            {name: "name"}
                        ]
                    }}
                ]},
                minify: "(id,name)"
            }
        });

    });

});