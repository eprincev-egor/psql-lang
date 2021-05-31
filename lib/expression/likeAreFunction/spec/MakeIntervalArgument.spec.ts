import { Sql } from "../../../Sql";
import { MakeIntervalArgument } from "../MakeIntervalArgument";

describe("MakeIntervalArgument", () => {

    it("valid inputs", () => {

        Sql.assertNode(MakeIntervalArgument, {
            input: "DAY => 10",
            shouldBe: {
                json: {
                    interval: "day",
                    value: {number: "10"}
                },
                pretty: "day => 10",
                minify: "day=>10"
            }
        });

        Sql.assertNode(MakeIntervalArgument, {
            input: "epOch := 9999",
            shouldBe: {
                json: {
                    interval: "epoch",
                    value: {number: "9999"}
                },
                pretty: "epoch => 9999",
                minify: "epoch=>9999"
            }
        });

    });

});