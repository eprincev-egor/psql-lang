import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.extract.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "extract(CENTURY FROM '2000-12-16 12:21:13')",
            shouldBe: {
                json: {
                    operand: {
                        extract: "century",
                        from: {string: "2000-12-16 12:21:13"}
                    }
                },
                pretty: "extract( century from '2000-12-16 12:21:13' )",
                minify: "extract(century from '2000-12-16 12:21:13')"
            }
        });

        const allIntervals = [
            "century",
            "day",
            "decade",
            "dow",
            "doy",
            "epoch",
            "hour",
            "microsecond",
            "millennium",
            "millisecond",
            "minute",
            "month",
            "quarter",
            "second",
            "timezone",
            "timezone_hour",
            "timezone_minute",
            "week",
            "year"
        ];
        for (const interval of allIntervals) {
            assertNode(Expression, {
                input: `extract(${interval} FROM some_date)`,
                shouldBe: {
                    json: {
                        operand: {
                            extract: interval,
                            from: {column: [
                                {name: "some_date"}
                            ]}
                        }
                    },
                    pretty: `extract( ${interval} from some_date )`,
                    minify: `extract(${interval} from some_date)`
                }
            });
        }

        const intervalsAliases = {
            centuries: "century",
            days: "day",
            decades: "decade",
            hours: "hour",
            microseconds: "microsecond",
            millenniums: "millennium",
            milliseconds: "millisecond",
            minutes: "minute",
            months: "month",
            seconds: "second",
            weeks: "week",
            years: "year"
        } as const;
        for (const alias in intervalsAliases) {
            const interval = intervalsAliases[
                alias as keyof typeof intervalsAliases
            ];

            assertNode(Expression, {
                input: `extract(${alias} FROM some_date)`,
                shouldBe: {
                    json: {
                        operand: {
                            extract: interval,
                            from: {column: [
                                {name: "some_date"}
                            ]}
                        }
                    },
                    pretty: `extract( ${interval} from some_date )`,
                    minify: `extract(${interval} from some_date)`
                }
            });
        }
    });

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "extract(unknown FROM orders.date)",
            throws: /unrecognized extract field: unknown/,
            target: "unknown"
        });

    });

});