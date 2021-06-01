import { Sql } from "../../Sql";
import { PgType } from "../PgType";

describe("PgType", () => {

    it("valid inputs", () => {

        Sql.assertNode(PgType, {
            input: "Timestamp",
            shouldBe: {
                json: {type: "timestamp"},
                pretty: "timestamp",
                minify: "timestamp"
            }
        });

        Sql.assertNode(PgType, {
            input: "numeric  ( 10 )",
            shouldBe: {
                json: {type: "numeric(10)"},
                pretty: "numeric(10)",
                minify: "numeric(10)"
            }
        });

        Sql.assertNode(PgType, {
            input: "numeric ( 10, 3 )",
            shouldBe: {
                json: {type: "numeric(10, 3)"},
                pretty: "numeric(10, 3)",
                minify: "numeric(10, 3)"
            }
        });

        Sql.assertNode(PgType, {
            input: "bigint[ ]",
            shouldBe: {
                json: {type: "bigint[]"},
                pretty: "bigint[]",
                minify: "bigint[]"
            }
        });

        Sql.assertNode(PgType, {
            input: "integer[]",
            shouldBe: {
                json: {type: "integer[]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "numeric(14, 3)[]",
            shouldBe: {
                json: {type: "numeric(14, 3)[]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "numeric(9) [] []",
            shouldBe: {
                json: {type: "numeric(9)[][]"},
                pretty: "numeric(9)[][]",
                minify: "numeric(9)[][]"
            }
        });

        Sql.assertNode(PgType, {
            input: "date[][][]",
            shouldBe: {
                json: {type: "date[][][]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "bigint[1]",
            shouldBe: {
                json: {type: "bigint[1]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "bigint[ 19 ]",
            shouldBe: {
                json: {type: "bigint[19]"},
                pretty: "bigint[19]",
                minify: "bigint[19]"
            }
        });

        Sql.assertNode(PgType, {
            input: "bigint[1][2][3]",
            shouldBe: {
                json: {type: "bigint[1][2][3]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "double Precision",
            shouldBe: {
                json: {type: "double precision"},
                pretty: "double precision",
                minify: "double precision"
            }
        });

        Sql.assertNode(PgType, {
            input: "DOUBLE \nPrecision",
            shouldBe: {
                json: {type: "double precision"},
                pretty: "double precision",
                minify: "double precision"
            }
        });

        Sql.assertNode(PgType, {
            input: "double precision[]",
            shouldBe: {
                json: {type: "double precision[]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "int4RANGE",
            shouldBe: {
                json: {type: "int4range"},
                pretty: "int4range",
                minify: "int4range"
            }
        });

        Sql.assertNode(PgType, {
            input: "int8range",
            shouldBe: {
                json: {type: "int8range"}
            }
        });

        Sql.assertNode(PgType, {
            input: "timestamp\r\nwithout\t TIME zone",
            shouldBe: {
                json: {type: "timestamp without time zone"},
                pretty: "timestamp without time zone",
                minify: "timestamp without time zone"
            }
        });

        Sql.assertNode(PgType, {
            input: "public . company",
            shouldBe: {
                json: {type: "public.company"},
                pretty: "public.company",
                minify: "public.company"
            }
        });

        Sql.assertNode(PgType, {
            input: "operation.unit",
            shouldBe: {
                json: {type: "operation.unit"}
            }
        });

        Sql.assertNode(PgType, {
            input: "PUBLIC . company",
            shouldBe: {
                json: {type: "public.company"},
                pretty: "public.company",
                minify: "public.company"
            }
        });

        Sql.assertNode(PgType, {
            input: "operation.unit[]",
            shouldBe: {
                json: {type: "operation.unit[]"}
            }
        });

        Sql.assertNode(PgType, {
            input: "\"char\"",
            shouldBe: {
                json: {type: "\"char\""}
            }
        });

        Sql.assertNode(PgType, {
            input: "\"SCHEMA\" . \"TABLE\"",
            shouldBe: {
                json: {type: "\"SCHEMA\".\"TABLE\""},
                minify: "\"SCHEMA\".\"TABLE\"",
                pretty: "\"SCHEMA\".\"TABLE\""
            }
        });

        Sql.assertNode(PgType, {
            input: "bigint else null",
            shouldBe: {
                json: {
                    type: "bigint"
                },
                pretty: "bigint",
                minify: "bigint"
            }
        });

        const allDefaultTypes: string[] = [
            "smallint",
            "integer",
            "bigint",
            "decimal",
            "numeric",
            "real",
            "double precision",
            "smallserial",
            "serial",
            "bigserial",
            "money",
            "character varying",
            "varchar",
            "character",
            "char",
            "text",
            "name",
            "bytea",
            "timestamp without time zone",
            "timestamp with time zone",
            "timestamp",
            "time without time zone",
            "time with time zone",
            "boolean",
            "point",
            "line",
            "lseg",
            "box",
            "path",
            "polygon",
            "path",
            "circle",
            "cidr",
            "inet",
            "macaddr",
            "macaddr8",
            "bit varying",
            "tsvector",
            "tsquery",
            "uuid",
            "xml",
            "json",
            "jsonb",
            "int",
            "int4range",
            "int8range",
            "numrange",
            "tsrange",
            "tstzrange",
            "daterange",
            "regclass",
            "regproc",
            "regprocedure",
            "regoper",
            "regoperator",
            "regclass",
            "regtype",
            "regrole",
            "regnamespace",
            "regconfig",
            "regdictionary",
            "date",
            "trigger",
            "void",
            "record",
            "anyarray",
            "anyelement",

            "bit varying(88)",
            "character varying(111)",
            "bit(1)",
            "char(1)",
            "character(1)",
            "varchar(1)"
        ];
        for (const type of allDefaultTypes) {

            Sql.assertNode(PgType, {
                input: type,
                shouldBe: {
                    json: {type}
                }
            });
        }

    });

});