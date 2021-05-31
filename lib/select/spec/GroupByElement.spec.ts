import { Sql } from "../../Sql";
import { GroupByElement } from "../GroupByElement";

describe("GroupByElement", () => {

    it("valid inputs", () => {

        Sql.assertNode(GroupByElement, {
            input: "order.date",
            shouldBe: {
                json: {expression: {
                    column: [
                        {name: "order"},
                        {name: "date"}
                    ]
                }}
            }
        });

        Sql.assertNode(GroupByElement, {
            input: "grouping Sets (brand, size, ( ))",
            shouldBe: {
                json: {groupingSets: [
                    {expression: {
                        column: [
                            {name: "brand"}
                        ]
                    }},
                    {expression: {
                        column: [
                            {name: "size"}
                        ]
                    }},
                    {empty: true}
                ]},
                pretty: "grouping sets (brand, size, ())",
                minify: "grouping sets(brand,size,())"
            }
        });

        Sql.assertNode(GroupByElement, {
            input: "cube ( brand, (size, 1))",
            shouldBe: {
                json: {cube: [
                    {expression: {
                        column: [
                            {name: "brand"}
                        ]
                    }},
                    {expressions: [
                        {column: [
                            {name: "size"}
                        ]},
                        {number: "1"}
                    ]}
                ]},
                pretty: "cube (brand, (size, 1))",
                minify: "cube(brand,(size,1))"
            }
        });

        Sql.assertNode(GroupByElement, {
            input: "rollup ( brand, (size, 1))",
            shouldBe: {
                json: {rollup: [
                    {expression: {
                        column: [
                            {name: "brand"}
                        ]
                    }},
                    {expressions: [
                        {column: [
                            {name: "size"}
                        ]},
                        {number: "1"}
                    ]}
                ]},
                pretty: "rollup (brand, (size, 1))",
                minify: "rollup(brand,(size,1))"
            }
        });

    });

});