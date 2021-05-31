import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.currentDate.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "current_date",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_date"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "current_time",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_time"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "current_timestamp",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_timestamp"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "localtime",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtime"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "localtimestamp",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtimestamp"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "current_time(1)",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_time",
                        precision: "1"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "CURRENT_TIMESTAMP ( 99 )",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_timestamp",
                        precision: "99"
                    }
                },
                pretty: "current_timestamp(99)",
                minify: "current_timestamp(99)"
            }
        });

        Sql.assertNode(Expression, {
            input: "localtime(20)",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtime",
                        precision: "20"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "localtimestamp(21)",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtimestamp",
                        precision: "21"
                    }
                }
            }
        });

    });

});