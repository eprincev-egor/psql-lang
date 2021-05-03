import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.orderBy.spec.ts: select ... order by ...", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select name from users order by id",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [{name: "name"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    orderBy: [{
                        expression: {
                            column: [
                                {name: "id"}
                            ]
                        },
                        vector: "asc"
                    }]
                },
                pretty: "select\n    name\nfrom users\norder by id asc",
                minify: "select name from users order by id asc"
            }
        });

        assertNode(Select, {
            input: "select name from users order by id desc",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [{name: "name"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    orderBy: [{
                        expression: {
                            column: [
                                {name: "id"}
                            ]
                        },
                        vector: "desc"
                    }]
                },
                pretty: "select\n    name\nfrom users\norder by id desc"
            }
        });

    });

});