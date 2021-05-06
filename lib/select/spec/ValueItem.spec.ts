import { assertNode } from "abstract-lang";
import { ValueItem } from "../ValueItem";

describe("ValueItem", () => {

    it("valid inputs", () => {

        assertNode(ValueItem, {
            input: "default",
            shouldBe: {
                json: {
                    default: true
                }
            }
        });

        assertNode(ValueItem, {
            input: "DEFAULT",
            shouldBe: {
                json: {
                    default: true
                },
                pretty: "default",
                minify: "default"
            }
        });

        assertNode(ValueItem, {
            input: "1",
            shouldBe: {
                json: {
                    value: {number: "1"}
                }
            }
        });

    });

});