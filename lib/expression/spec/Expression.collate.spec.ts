import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.collate.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "'' Collate \"POSIX\"",
            shouldBe: {
                json: {
                    operand: {
                        operand: {string: ""},
                        collate: {strictName: "POSIX"}
                    }
                },
                minify: "'' collate \"POSIX\"",
                pretty: "'' collate \"POSIX\""
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name collate \"fr_FR\"",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        collate: {strictName: "fr_FR"}
                    }
                }
            }
        });

    });

});