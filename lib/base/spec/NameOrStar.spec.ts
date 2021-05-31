import { Sql } from "../../Sql";
import { NameOrStar } from "../NameOrStar";

describe("NameOrStar", () => {

    it("valid inputs", () => {

        Sql.assertNode(NameOrStar, {
            input: "name",
            shouldBe: {
                json: {name: {name: "name"}}
            }
        });

        Sql.assertNode(NameOrStar, {
            input: "\"name\"",
            shouldBe: {
                json: {name: {strictName: "name"}}
            }
        });

        Sql.assertNode(NameOrStar, {
            input: "*",
            shouldBe: {
                json: {star: true}
            }
        });

    });

});