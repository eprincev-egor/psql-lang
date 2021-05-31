import { Sql } from "../../Sql";
import { ValueRow } from "../ValueRow";

describe("ValueRow", () => {

    it("valid inputs", () => {

        Sql.assertNode(ValueRow, {
            input: "( 1, default)",
            shouldBe: {
                json: {
                    values: [
                        {value: {number: "1"}},
                        {default: true}
                    ]
                },
                pretty: "(1, default)",
                minify: "(1,default)"
            }
        });

    });

});