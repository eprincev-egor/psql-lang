import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.like.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "company.name ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name not ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name not like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name similar '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "similar",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name not similar '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not similar",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

    });

});