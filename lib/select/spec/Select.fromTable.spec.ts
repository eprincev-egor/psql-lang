import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.fromTable.spec.ts: select ... from ...table...", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select from users as u(x,y,z)",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {name: {name: "users"}},
                        as: {name: "u"},
                        columnAliases: [
                            {name: "x"},
                            {name: "y"},
                            {name: "z"}
                        ]
                    }]
                },
                pretty: [
                    "select",
                    "from users as u(x, y, z)"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select from only base_table",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        only: true,
                        table: {name: {name: "base_table"}}
                    }]
                },
                pretty: [
                    "select",
                    "from only base_table"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select from base_table *",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        all: true,
                        table: {name: {name: "base_table"}}
                    }]
                },
                pretty: [
                    "select",
                    "from base_table *"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select from only base_table *",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        only: true,
                        all: true,
                        table: {name: {name: "base_table"}}
                    }]
                },
                pretty: [
                    "select",
                    "from only base_table *"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select from database.schema.table",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            database: {name: "database"},
                            schema: {name: "schema"},
                            name: {name: "table"}
                        }
                    }]
                },
                pretty: [
                    "select",
                    "from database.schema.table"
                ].join("\n")
            }
        });

    });

});