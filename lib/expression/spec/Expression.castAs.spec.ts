import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.castAs.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "cast( 'hello' as text )",
            shouldBe: {
                json: {
                    operand: {
                        cast: {string: "hello"},
                        as: {type: "text"}
                    }
                },
                minify: "cast('hello' as text)"
            }
        });

        Sql.assertNode(Expression, {
            input: "cast( a / b as text )",
            shouldBe: {
                json: {
                    operand: {
                        cast: {
                            left: {column: [{name: "a"}]},
                            operator: "/",
                            right: {column: [{name: "b"}]}
                        },
                        as: {type: "text"}
                    }
                },
                minify: "cast(a/b as text)"
            }
        });

        Sql.assertNode(Expression, {
            input: "cast( 1 as text )",
            shouldBe: {
                json: {
                    operand: {
                        cast: {number: "1"},
                        as: {type: "text"}
                    }
                },
                minify: "cast(1 as text)"
            }
        });

        Sql.assertNode(Expression, {
            input: "cast( 'hello' as text )",
            shouldBe: {
                json: {
                    operand: {
                        cast: {string: "hello"},
                        as: {type: "text"}
                    }
                },
                minify: "cast('hello' as text)"
            }
        });

        Sql.assertNode(Expression, {
            input: "cast(fin_oper_buy.sum_with_vat / 10000.0 as decimal(14,2))",
            shouldBe: {
                json: {
                    operand: {
                        cast: {
                            left: {column: [
                                {name: "fin_oper_buy"},
                                {name: "sum_with_vat"}
                            ]},
                            operator: "/",
                            right: {number: "10000.0"}
                        },
                        as: {type: "decimal(14, 2)"}
                    }
                },
                pretty: "cast( fin_oper_buy.sum_with_vat / 10000.0 as decimal(14, 2) )",
                minify: "cast(fin_oper_buy.sum_with_vat/10000.0 as decimal(14, 2))"
            }
        });

    });

});