import { Sql } from "../../Sql";
import { ColumnReference } from "../ColumnReference";

describe("ColumnReference", () => {

    it("valid inputs", () => {

        Sql.assertNode(ColumnReference, {
            input: "name",
            shouldBe: {
                json: {
                    column: [{name: "name"}]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "table.column",
            shouldBe: {
                json: {
                    column: [
                        {name: "table"},
                        {name: "column"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "schema.table.column",
            shouldBe: {
                json: {
                    column: [
                        {name: "schema"},
                        {name: "table"},
                        {name: "column"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "database.schema.table.column",
            shouldBe: {
                json: {
                    column: [
                        {name: "database"},
                        {name: "schema"},
                        {name: "table"},
                        {name: "column"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "schema.table",
            shouldBe: {
                json: {
                    column: [
                        {name: "schema"},
                        {name: "table"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "table",
            shouldBe: {
                json: {
                    column: [
                        {name: "table"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "SCHEMA_name  .  TABLE_name  .  COLUMN_NAME",
            shouldBe: {
                json: {
                    column: [
                        {name: "schema_name"},
                        {name: "table_name"},
                        {name: "column_name"}
                    ]
                },
                pretty: "schema_name.table_name.column_name",
                minify: "schema_name.table_name.column_name"
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "\" table \" . \" COLUMN \"",
            shouldBe: {
                json: {
                    column: [
                        {strictName: " table "},
                        {strictName: " COLUMN "}
                    ]
                },
                pretty: "\" table \".\" COLUMN \"",
                minify: "\" table \".\" COLUMN \""
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "TABLE  . \" COLUMN \"",
            shouldBe: {
                json: {
                    column: [
                        {name: "table"},
                        {strictName: " COLUMN "}
                    ]
                },
                pretty: "table.\" COLUMN \"",
                minify: "table.\" COLUMN \""
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "\" TABLE \" . COLUMN ",
            shouldBe: {
                json: {
                    column: [
                        {strictName: " TABLE "},
                        {name: "column"}
                    ]
                },
                pretty: "\" TABLE \".column",
                minify: "\" TABLE \".column"
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "public.\"*\"",
            shouldBe: {
                json: {
                    column: [
                        {name: "public"},
                        {strictName: "*"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "company.*",
            shouldBe: {
                json: {
                    allColumns: true,
                    column: [
                        {name: "company"}
                    ]
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "*",
            shouldBe: {
                json: {
                    allColumns: true,
                    column: []
                }
            }
        });

        Sql.assertNode(ColumnReference, {
            input: "schema . table . *",
            shouldBe: {
                json: {
                    allColumns: true,
                    column: [
                        {name: "schema"},
                        {name: "table"}
                    ]
                },
                pretty: "schema.table.*",
                minify: "schema.table.*"
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(ColumnReference, {
            input: "a.b.c.d.e",
            throws: /improper qualified name \(too many dotted names\): a\.b\.c\.d\.e/,
            target: "e"
        });

        Sql.assertNode(ColumnReference, {
            input: "*.*",
            throws: /improper use of "\*"/,
            target: "*"
        });

        Sql.assertNode(ColumnReference, {
            input: "a.*.*",
            throws: /improper use of "\*"/,
            target: "*"
        });

    });

});