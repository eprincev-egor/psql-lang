import { Sql } from "../../Sql";
import { UEscape } from "../UEscape";

describe("UEscape", () => {

    it("valid inputs", () => {
        Sql.assertNode(UEscape, {
            input: "uescape '!'",
            shouldBe: {
                json: {escape: "!"}
            }
        });
    });

});