import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.between.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "id between 1 and 100",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "id"}
                        ]},
                        between: {number: "1"},
                        and: {number: "100"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "orders.profit between symmetric 3 * 100 and 4 * 3000",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "profit"}
                        ]},
                        symmetric: true,
                        between: {
                            left: {number: "3"},
                            operator: "*",
                            right: {number: "100"}
                        },
                        and: {
                            left: {number: "4"},
                            operator: "*",
                            right: {number: "3000"}
                        }
                    }
                },
                minify: "orders.profit between symmetric 3*100 and 4*3000"
            }
        });

        Sql.assertNode(Expression, {
            input: "company.id between 1 and 2 or company.id between 5 and 6",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operand: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            between: {number: "1"},
                            and: {number: "2"}
                        },
                        operator: "or",
                        right: {
                            operand: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            between: {number: "5"},
                            and: {number: "6"}
                        }
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.id between 1 and 2 + 3 <= true",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operand: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            between: {number: "1"},
                            and: {
                                left: {number: "2"},
                                operator: "+",
                                right: {number: "3"}
                            }
                        },
                        operator: "<=",
                        right: {boolean: true}
                    }
                },
                minify: "company.id between 1 and 2+3<=true"
            }
        });

        const stopOperators = [
            ">", "<", ">=", "<=", "="
        ];
        for (const stopOperator of stopOperators) {
            Sql.assertNode(Expression, {
                input: `profit between 1 and 2 ${stopOperator} false`,
                shouldBe: {
                    json: {
                        operand: {
                            left: {
                                operand: {column: [
                                    {name: "profit"}
                                ]},
                                between: {number: "1"},
                                and: {number: "2"}
                            },
                            operator: stopOperator,
                            right: {boolean: false}
                        }
                    },
                    minify: `profit between 1 and 2${stopOperator}false`
                }
            });
        }

        Sql.assertNode(Expression, {
            input: "profit between 1 and 2 and date > now()",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operand: {column: [
                                {name: "profit"}
                            ]},
                            between: {number: "1"},
                            and: {number: "2"}
                        },
                        operator: "and",
                        right: {
                            left: {column: [
                                {name: "date"}
                            ]},
                            operator: ">",
                            right: {
                                call: {name: {name: "now"}},
                                arguments: []
                            }
                        }
                    }
                },
                minify: "profit between 1 and 2 and date>now()"
            }
        });

        Sql.assertNode(Expression, {
            input: "id not between 1 and 100",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "id"}
                        ]},
                        notBetween: {number: "1"},
                        and: {number: "100"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "orders.profit not between symmetric 3 * 100 and 4 * 3000",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "profit"}
                        ]},
                        symmetric: true,
                        notBetween: {
                            left: {number: "3"},
                            operator: "*",
                            right: {number: "100"}
                        },
                        and: {
                            left: {number: "4"},
                            operator: "*",
                            right: {number: "3000"}
                        }
                    }
                },
                minify: "orders.profit not between symmetric 3*100 and 4*3000"
            }
        });

    });

});