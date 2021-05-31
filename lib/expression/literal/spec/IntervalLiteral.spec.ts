import { Sql } from "../../../Sql";
import { IntervalLiteral } from "../IntervalLiteral";

describe("IntervalLiteral", () => {

    it("valid inputs", () => {

        Sql.assertNode(IntervalLiteral, {
            input: "interval '1 day'",
            shouldBe: {
                json: {interval: {string: "1 day"}}
            }
        });

        Sql.assertNode(IntervalLiteral, {
            input: "interval $$10 days$$",
            shouldBe: {
                json: {interval: {tag: "", string: "10 days"}}
            }
        });

        Sql.assertNode(IntervalLiteral, {
            input: "INTERVAL    '2 years'",
            shouldBe: {
                json: {interval: {string: "2 years"}},
                pretty: "interval '2 years'",
                minify: "interval '2 years'"
            }
        });

    });

});