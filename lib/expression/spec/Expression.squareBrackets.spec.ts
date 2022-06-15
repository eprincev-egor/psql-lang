import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.squareBrackets.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "company.roles_ids[1]",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "company"},
                            {name: "roles_ids"}
                        ]},
                        index: {number: "1"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.roles_ids[2 * 8]",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "company"},
                            {name: "roles_ids"}
                        ]},
                        index: {
                            left: {number: "2"},
                            operator: "*",
                            right: {number: "8"}
                        }
                    }
                },
                minify: "company.roles_ids[2*8]"
            }
        });

        Sql.assertNode(Expression, {
            input: "some_matrix[1][2]",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            operand: {column: [
                                {name: "some_matrix"}
                            ]},
                            index: {number: "1"}
                        },
                        index: {number: "2"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "some_matrix[1][2][3]",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            operand: {
                                operand: {column: [
                                    {name: "some_matrix"}
                                ]},
                                index: {number: "1"}
                            },
                            index: {number: "2"}
                        },
                        index: {number: "3"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "roles  [100]",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "roles"}
                        ]},
                        index: {number: "100"}
                    }
                },
                minify: "roles[100]",
                pretty: "roles[100]"
            }
        });

        Sql.assertNode(Expression, {
            input: "company.roles_ids[1]::bigint",
            shouldBe: {
                json: {
                    operand: {
                        cast: {
                            operand: {column: [
                                {name: "company"},
                                {name: "roles_ids"}
                            ]},
                            index: {number: "1"}
                        },
                        to: {type: "bigint"}
                    }
                }
            }
        });

    });

});