import { assertNode } from "abstract-lang";
import { SelectColumn } from "../SelectColumn";

describe("SelectColumn", () => {

    it("valid inputs", () => {

        assertNode(SelectColumn, {
            input: "order.date as order_date",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "order"},
                            {name: "date"}
                        ]
                    },
                    as: {name: "order_date"}
                }
            }
        });

    });

});