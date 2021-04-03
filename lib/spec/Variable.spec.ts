import { assertNode } from "abstract-lang";
import { Variable } from "../Variable";

describe("Variable", () => {

    it("valid inputs", () => {
        assertNode(Variable, {
            input: "$hello",
            shouldBe: {
                json: {variable: "hello"}
            }
        });

        assertNode(Variable, {
            input: "$world",
            shouldBe: {
                json: {variable: "world"}
            }
        });

        assertNode(Variable, {
            input: "$NAME",
            shouldBe: {
                json: {variable: "NAME"}
            }
        });

        assertNode(Variable, {
            input: "$_",
            shouldBe: {
                json: {variable: "_"}
            }
        });

        assertNode(Variable, {
            input: "$a1",
            shouldBe: {
                json: {variable: "a1"}
            }
        });

        assertNode(Variable, {
            input: "$xx zz",
            shouldBe: {
                json: {variable: "xx"},
                pretty: "$xx",
                minify: "$xx"
            }
        });

        assertNode(Variable, {
            input: "$1",
            shouldBe: {
                json: {variable: "1"}
            }
        });

    });

});