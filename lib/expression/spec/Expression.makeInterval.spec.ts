import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.makeInterval.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "make_interval(weeks => 2, days => 3)",
            shouldBe: {
                json: {
                    operand: {
                        intervalArguments: [
                            {
                                interval: "weeks",
                                value: {number: "2"}
                            },
                            {
                                interval: "days",
                                value: {number: "3"}
                            }
                        ]
                    }
                },
                pretty: "make_interval(weeks => 2, days => 3)",
                minify: "make_interval(weeks=>2,days=>3)"
            }
        });

        Sql.assertNode(Expression, {
            input: "make_interval(days => 2)",
            shouldBe: {
                json: {
                    operand: {
                        intervalArguments: [
                            {
                                interval: "days",
                                value: {number: "2"}
                            }
                        ]
                    }
                },
                pretty: "make_interval(days => 2)",
                minify: "make_interval(days=>2)"
            }
        });

        Sql.assertNode(Expression, {
            input: "make_interval(year:= 8)",
            shouldBe: {
                json: {
                    operand: {
                        intervalArguments: [
                            {
                                interval: "year",
                                value: {number: "8"}
                            }
                        ]
                    }
                },
                pretty: "make_interval(year => 8)",
                minify: "make_interval(year=>8)"
            }
        });

        Sql.assertNode(Expression, {
            input: "make_interval(1, 2, 3, 4, 5, 6, 7)",
            shouldBe: {
                json: {
                    operand: {
                        intervalArguments: [
                            {value: {number: "1"}},
                            {value: {number: "2"}},
                            {value: {number: "3"}},
                            {value: {number: "4"}},
                            {value: {number: "5"}},
                            {value: {number: "6"}},
                            {value: {number: "7"}}
                        ]
                    }
                },
                minify: "make_interval(1,2,3,4,5,6,7)"
            }
        });

        Sql.assertNode(Expression, {
            input: "MAKE_INTERVAL(  HOURS => 24  )",
            shouldBe: {
                json: {
                    operand: {
                        intervalArguments: [
                            {
                                interval: "hours",
                                value: {number: "24"}
                            }
                        ]
                    }
                },
                pretty: "make_interval(hours => 24)",
                minify: "make_interval(hours=>24)"
            }
        });

    });

});