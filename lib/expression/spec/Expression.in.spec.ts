import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.in.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "orders.type in (1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        in: [
                            {number: "1"},
                            {number: "2"}
                        ]
                    }
                },
                minify: "orders.type in(1,2)"
            }
        });

        Sql.assertNode(Expression, {
            input: "orders.type not in (3, 4, 5)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        notIn: [
                            {number: "3"},
                            {number: "4"},
                            {number: "5"}
                        ]
                    }
                },
                minify: "orders.type not in(3,4,5)"
            }
        });

        Sql.assertNode(Expression, {
            input: "orders.type in (select 1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        in: {
                            select: [
                                {expression: {number: "1"}},
                                {expression: {number: "2"}}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "orders.type in (select",
                    "    1,",
                    "    2)"
                ].join("\n"),
                minify: "orders.type in(select 1,2)"
            }
        });

        Sql.assertNode(Expression, {
            input: "orders.type not in (select 1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        notIn: {
                            select: [
                                {expression: {number: "1"}},
                                {expression: {number: "2"}}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "orders.type not in (select",
                    "    1,",
                    "    2)"
                ].join("\n"),
                minify: "orders.type not in(select 1,2)"
            }
        });

    });

});