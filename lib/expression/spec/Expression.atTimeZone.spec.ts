import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.atTimeZone.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "timestamp '2001-09-28 01:00' at time zone 'utc'",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            timestamp: {string: "2001-09-28 01:00"},
                            type: "timestamp"
                        },
                        atTimeZone: {string: "utc"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "now() at time zone \n \t \r 'utc'",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            call: {
                                name: {name: "now"}
                            },
                            arguments: []
                        },
                        atTimeZone: {string: "utc"}
                    }
                },
                pretty: "now() at time zone 'utc'",
                minify: "now()at time zone 'utc'"
            }
        });

        Sql.assertNode(Expression, {
            input: "now()::timestamp without time zone at time zone 'utc'",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            cast: {
                                call: {
                                    name: {name: "now"}
                                },
                                arguments: []
                            },
                            as: {type: "timestamp without time zone"}
                        },
                        atTimeZone: {string: "utc"}
                    }
                }
            }
        });

    });

});