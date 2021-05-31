import { Sql } from "../../../Sql";
import { NullLiteral } from "../NullLiteral";

describe("NullLiteral", () => {

    it("valid inputs", () => {

        Sql.assertNode(NullLiteral, {
            input: "null",
            shouldBe: {
                json: {null: true}
            }
        });

        Sql.assertNode(NullLiteral, {
            input: "NULL",
            shouldBe: {
                json: {null: true},
                pretty: "null",
                minify: "null"
            }
        });

    });

});