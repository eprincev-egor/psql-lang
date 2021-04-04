import { assertNode } from "abstract-lang";
import { NameOrStar } from "../NameOrStar";

describe("NameOrStar", () => {

    it("valid inputs", () => {

        assertNode(NameOrStar, {
            input: "name",
            shouldBe: {
                json: {name: {name: "name"}}
            }
        });

        assertNode(NameOrStar, {
            input: "\"name\"",
            shouldBe: {
                json: {name: {strictName: "name"}}
            }
        });

        assertNode(NameOrStar, {
            input: "*",
            shouldBe: {
                json: {star: true}
            }
        });

    });

});