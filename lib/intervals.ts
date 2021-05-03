import { Cursor } from "abstract-lang";

export type IntervalType = typeof intervals[number];

export const intervals = [
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
] as const;

export const intervalsAliases = {
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

export function tryParseInterval(cursor: Cursor): IntervalType | undefined {
    const token = cursor.nextToken.value.toLowerCase();

    if ( token in intervalsAliases ) {
        const alias = token as keyof typeof intervalsAliases;
        const interval = intervalsAliases[ alias ];

        cursor.next();
        return interval;
    }

    if ( intervals.includes(token as any) ) {
        const interval = token as IntervalType;

        cursor.next();
        return interval;
    }
}