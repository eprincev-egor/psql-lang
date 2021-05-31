import { Sql } from "../../../Sql";
import { NumberLiteral } from "../NumberLiteral";

describe("NumberLiteral", () => {

    it("valid inputs", () => {
        Sql.assertNode(NumberLiteral, {
            input: "0",
            shouldBe: {
                json: {number: "0"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1",
            shouldBe: {
                json: {number: "1"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1.10",
            shouldBe: {
                json: {number: "1.10"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1234567890",
            shouldBe: {
                json: {number: "1234567890"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "-20",
            shouldBe: {
                json: {number: "-20"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "-20.5",
            shouldBe: {
                json: {number: "-20.5"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "-.1",
            shouldBe: {
                json: {number: "-.1"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1e10",
            shouldBe: {
                json: {number: "1e10"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1.05e10",
            shouldBe: {
                json: {number: "1.05e10"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1.925e-3",
            shouldBe: {
                json: {number: "1.925e-3"}
            }
        });

        Sql.assertNode(NumberLiteral, {
            input: "1.925e+3",
            shouldBe: {
                json: {number: "1.925e+3"}
            }
        });
    });

});