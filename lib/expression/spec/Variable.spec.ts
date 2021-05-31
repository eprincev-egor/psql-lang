import { Sql } from "../../Sql";
import { Variable } from "../Variable";

describe("Variable", () => {

    it("valid inputs", () => {
        Sql.assertNode(Variable, {
            input: "$hello",
            shouldBe: {
                json: {variable: "hello"}
            }
        });

        Sql.assertNode(Variable, {
            input: "$world",
            shouldBe: {
                json: {variable: "world"}
            }
        });

        Sql.assertNode(Variable, {
            input: "$NAME",
            shouldBe: {
                json: {variable: "NAME"}
            }
        });

        Sql.assertNode(Variable, {
            input: "$_",
            shouldBe: {
                json: {variable: "_"}
            }
        });

        Sql.assertNode(Variable, {
            input: "$a1",
            shouldBe: {
                json: {variable: "a1"}
            }
        });

        Sql.assertNode(Variable, {
            input: "$xx zz",
            shouldBe: {
                json: {variable: "xx"},
                pretty: "$xx",
                minify: "$xx"
            }
        });

        Sql.assertNode(Variable, {
            input: "$1",
            shouldBe: {
                json: {variable: "1"}
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Variable, {
            input: "$",
            throws: /expected variable name/,
            target: "$"
        });

    });

});