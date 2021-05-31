import { Sql } from "../../Sql";
import { ValueItem } from "../ValueItem";

describe("ValueItem", () => {

    it("valid inputs", () => {

        Sql.assertNode(ValueItem, {
            input: "default",
            shouldBe: {
                json: {
                    default: true
                }
            }
        });

        Sql.assertNode(ValueItem, {
            input: "DEFAULT",
            shouldBe: {
                json: {
                    default: true
                },
                pretty: "default",
                minify: "default"
            }
        });

        Sql.assertNode(ValueItem, {
            input: "1",
            shouldBe: {
                json: {
                    value: {number: "1"}
                }
            }
        });

    });

});