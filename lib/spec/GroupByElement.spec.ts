import { assertNode } from "abstract-lang";
import { GroupByElement } from "../GroupByElement";

describe("GroupByElement", () => {

    it("valid inputs", () => {

        assertNode(GroupByElement, {
            input: "order.date",
            shouldBe: {
                json: {expression: {operand: {
                    column: [
                        {name: "order"},
                        {name: "date"}
                    ]
                }}}
            }
        });

        assertNode(GroupByElement, {
            input: "grouping Sets (brand, size, ( ))",
            shouldBe: {
                json: {groupingSets: [
                    {expression: {operand: {
                        column: [
                            {name: "brand"}
                        ]
                    }}},
                    {expression: {operand: {
                        column: [
                            {name: "size"}
                        ]
                    }}},
                    {empty: true}
                ]},
                pretty: "grouping sets (brand, size, ())",
                minify: "grouping sets(brand,size,())"
            }
        });

        assertNode(GroupByElement, {
            input: "cube ( brand, (size, 1))",
            shouldBe: {
                json: {cube: [
                    {expression: {operand: {
                        column: [
                            {name: "brand"}
                        ]
                    }}},
                    {expressions: [
                        {operand: {
                            column: [
                                {name: "size"}
                            ]
                        }},
                        {operand: {
                            number: "1"
                        }}
                    ]}
                ]},
                pretty: "cube (brand, (size, 1))",
                minify: "cube(brand,(size,1))"
            }
        });

        assertNode(GroupByElement, {
            input: "rollup ( brand, (size, 1))",
            shouldBe: {
                json: {rollup: [
                    {expression: {operand: {
                        column: [
                            {name: "brand"}
                        ]
                    }}},
                    {expressions: [
                        {operand: {
                            column: [
                                {name: "size"}
                            ]
                        }},
                        {operand: {
                            number: "1"
                        }}
                    ]}
                ]},
                pretty: "rollup (brand, (size, 1))",
                minify: "rollup(brand,(size,1))"
            }
        });

    });

});