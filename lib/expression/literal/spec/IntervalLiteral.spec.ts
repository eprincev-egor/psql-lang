import { assertNode } from "abstract-lang";
import { IntervalLiteral } from "../IntervalLiteral";

describe("IntervalLiteral", () => {

    it("valid inputs", () => {

        assertNode(IntervalLiteral, {
            input: "interval '1 day'",
            shouldBe: {
                json: {interval: {string: "1 day"}}
            }
        });

        assertNode(IntervalLiteral, {
            input: "interval $$10 days$$",
            shouldBe: {
                json: {interval: {tag: "", string: "10 days"}}
            }
        });

        assertNode(IntervalLiteral, {
            input: "INTERVAL    '2 years'",
            shouldBe: {
                json: {interval: {string: "2 years"}},
                pretty: "interval '2 years'",
                minify: "interval '2 years'"
            }
        });

    });

});