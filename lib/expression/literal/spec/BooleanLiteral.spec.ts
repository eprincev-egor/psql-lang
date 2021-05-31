import { Sql } from "../../../Sql";
import { BooleanLiteral } from "../BooleanLiteral";

describe("BooleanLiteral", () => {

    it("valid inputs", () => {
        Sql.assertNode(BooleanLiteral, {
            input: "true",
            shouldBe: {
                json: {boolean: true}
            }
        });

        Sql.assertNode(BooleanLiteral, {
            input: "TRUE",
            shouldBe: {
                json: {boolean: true},
                pretty: "true",
                minify: "true"
            }
        });

        Sql.assertNode(BooleanLiteral, {
            input: "false",
            shouldBe: {
                json: {boolean: false}
            }
        });

        Sql.assertNode(BooleanLiteral, {
            input: "FALSE",
            shouldBe: {
                json: {boolean: false},
                pretty: "false",
                minify: "false"
            }
        });
    });

});