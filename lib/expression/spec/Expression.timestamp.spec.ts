import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.timestamp.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "timestamp '2001-09-28 01:00'",
            shouldBe: {
                json: {
                    operand: {
                        timestamp: {string: "2001-09-28 01:00"},
                        type: "timestamp"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "TIMESTAMP\nwithout TIME zone '1900-09-28 01:00'",
            shouldBe: {
                json: {
                    operand: {
                        timestamp: {string: "1900-09-28 01:00"},
                        type: "timestamp without time zone"
                    }
                },
                pretty: "timestamp without time zone '1900-09-28 01:00'",
                minify: "timestamp without time zone '1900-09-28 01:00'"
            }
        });

        Sql.assertNode(Expression, {
            input: "date '2001-09-28'",
            shouldBe: {
                json: {
                    operand: {
                        timestamp: {string: "2001-09-28"},
                        type: "date"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "date ('2001-09-28' + interval '1 hour')",
            shouldBe: {
                json: {
                    operand: {
                        timestamp: {
                            subExpression: {
                                left: {string: "2001-09-28"},
                                operator: "+",
                                right: {interval: {string: "1 hour"}}
                            }
                        },
                        type: "date"
                    }
                },
                minify: "date ('2001-09-28'+interval '1 hour')"
            }
        });

        Sql.assertNode(Expression, {
            input: "time '22:00'",
            shouldBe: {
                json: {
                    operand: {
                        timestamp: {string: "22:00"},
                        type: "time"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "date > now()",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "date"}
                        ]},
                        operator: ">",
                        right: {
                            call: {name: {name: "now"}},
                            arguments: []
                        }
                    }
                },
                minify: "date>now()"
            }
        });

    });

});