import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.collate.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
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

        assertNode(Expression, {
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