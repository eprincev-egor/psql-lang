import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.equalAny.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "2 = any(company.roles_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "2"},
                        equalAny: {
                            column: [
                                {name: "company"},
                                {name: "roles_ids"}
                            ]
                        }
                    }
                },
                minify: "2=any(company.roles_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "3 = any(array[2, 1]) = any(array[false])",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            operand: {number: "3"},
                            equalAny: {
                                array: [
                                    {number: "2"},
                                    {number: "1"}
                                ]
                            }
                        },
                        equalAny: {
                            array: [
                                {boolean: false}
                            ]
                        }
                    }
                },
                minify: "3=any(array[2,1])=any(array[false])"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id = some(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        equalSome: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id=some(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id = all(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        equalAll: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id=all(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id != any(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualAny: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id!=any(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id <> any(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualAny: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                pretty: "unit.id != any(orders.units_ids)",
                minify: "unit.id!=any(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id != some(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualSome: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id!=some(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id <> some(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualSome: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                pretty: "unit.id != some(orders.units_ids)",
                minify: "unit.id!=some(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id != all(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualAll: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                minify: "unit.id!=all(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "unit.id <> all(orders.units_ids)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "unit"},
                            {name: "id"}
                        ]},
                        notEqualAll: {
                            column: [
                                {name: "orders"},
                                {name: "units_ids"}
                            ]
                        }
                    }
                },
                pretty: "unit.id != all(orders.units_ids)",
                minify: "unit.id!=all(orders.units_ids)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 = any(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        equalAny: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 = any( select",
                    "    1)"
                ].join("\n"),
                minify: "1=any( select 1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 = all(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        equalAll: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 = all( select",
                    "    1)"
                ].join("\n"),
                minify: "1=all( select 1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 = some(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        equalSome: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 = some( select",
                    "    1)"
                ].join("\n"),
                minify: "1=some( select 1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 != any(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        notEqualAny: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 != any( select",
                    "    1)"
                ].join("\n"),
                minify: "1!=any( select 1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 != all(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        notEqualAll: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 != all( select",
                    "    1)"
                ].join("\n"),
                minify: "1!=all( select 1)"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 != some(select 1)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {number: "1"},
                        notEqualSome: {
                            select: [{
                                expression: {number: "1"}
                            }],
                            from: []
                        }
                    }
                },
                pretty: [
                    "1 != some( select",
                    "    1)"
                ].join("\n"),
                minify: "1!=some( select 1)"
            }
        });

    });

});