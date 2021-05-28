import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.currentDate.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "current_date",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_date"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "current_time",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_time"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "current_timestamp",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "current_timestamp"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "localtime",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtime"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "localtimestamp",
            shouldBe: {
                json: {
                    operand: {
                        dateType: "localtimestamp"
                    }
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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