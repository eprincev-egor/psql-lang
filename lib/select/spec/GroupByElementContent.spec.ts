import { Sql } from "../../Sql";
import { GroupByElementContent } from "../GroupByElementContent";

describe("GroupByElementContent", () => {

    it("valid inputs", () => {

        Sql.assertNode(GroupByElementContent, {
            input: "id",
            shouldBe: {
                json: {expression: {
                    column: [
                        {name: "id"}
                    ]
                }}
            }
        });

        Sql.assertNode(GroupByElementContent, {
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