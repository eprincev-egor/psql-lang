import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.overlay.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "OVERLAY('Txxxxas' placing 'hom' from 2 for 4)",
            shouldBe: {
                json: {
                    operand: {
                        overlay: {string: "Txxxxas"},
                        placing: {string: "hom"},
                        from: {number: "2"},
                        for: {number: "4"}
                    }
                },
                pretty: "overlay( 'Txxxxas' placing 'hom' from 2 for 4 )",
                minify: "overlay('Txxxxas' placing 'hom' from 2 for 4)"
            }
        });

        Sql.assertNode(Expression, {
            input: "overlay('Txxxxas' placing 'hom' from 2)",
            shouldBe: {
                json: {
                    operand: {
                        overlay: {string: "Txxxxas"},
                        placing: {string: "hom"},
                        from: {number: "2"}
                    }
                },
                pretty: "overlay( 'Txxxxas' placing 'hom' from 2 )"
            }
        });
    });

});