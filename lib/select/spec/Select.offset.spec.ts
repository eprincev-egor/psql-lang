import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.offset.spec.ts: offset/limit/...", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select name from users limit 10",
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
                    limit: {number: "10"}
                },
                pretty: "select\n    name\nfrom users\nlimit 10"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users limit all",
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
                    }]
                },
                pretty: "select\n    name\nfrom users",
                minify: "select name from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users offset 10",
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
                    offset: {number: "10"}
                },
                pretty: "select\n    name\nfrom users\noffset 10"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users offset 1000 limit 120",
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
                    offset: {number: "1000"},
                    limit: {number: "120"}
                },
                pretty: "select\n    name\nfrom users\noffset 1000\nlimit 120"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users limit 120 offset 1000",
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
                    offset: {number: "1000"},
                    limit: {number: "120"}
                },
                pretty: "select\n    name\nfrom users\noffset 1000\nlimit 120",
                minify: "select name from users offset 1000 limit 120"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users fetch first 100 rows only",
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
                    fetch: {
                        type: "first",
                        count: {number: "100"}
                    }
                },
                pretty: "select\n    name\nfrom users\nfetch first 100 rows only"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users fetch next 1 row only",
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
                    fetch: {
                        type: "next",
                        count: {number: "1"}
                    }
                },
                pretty: "select\n    name\nfrom users\nfetch next 1 rows only",
                minify: "select name from users fetch next 1 rows only"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users fetch next row only",
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
                    fetch: {
                        type: "next"
                    }
                },
                pretty: "select\n    name\nfrom users\nfetch next rows only",
                minify: "select name from users fetch next rows only"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users offset 10 fetch next row only",
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
                    offset: {number: "10"},
                    fetch: {type: "next"}
                },
                pretty: "select\n    name\nfrom users\noffset 10\nfetch next rows only",
                minify: "select name from users offset 10 fetch next rows only"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users offset 10 - 3 fetch next row only",
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
                    offset: {
                        left: {number: "10"},
                        operator: "-",
                        right: {number: "3"}
                    },
                    fetch: {type: "next"}
                },
                pretty: "select\n    name\nfrom users\noffset 10 - 3\nfetch next rows only",
                minify: "select name from users offset 10-3 fetch next rows only"
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Select, {
            input: "select * from users limit 10 limit 20",
            throws: /duplicated limit/,
            target: "limit"
        });

        Sql.assertNode(Select, {
            input: "select * from users limit 10 offset 1 limit 20",
            throws: /duplicated limit/,
            target: "limit"
        });

        Sql.assertNode(Select, {
            input: "select * from users offset 10 offset 20",
            throws: /duplicated offset/,
            target: "offset"
        });

        Sql.assertNode(Select, {
            input: "select * from users offset 10 limit 4 offset 20",
            throws: /duplicated offset/,
            target: "offset"
        });

        Sql.assertNode(Select, {
            input: "select * from users fetch next rows only limit 10",
            throws: /unexpected limit, fetch already exists/,
            target: "limit"
        });

        Sql.assertNode(Select, {
            input: "select * from users limit 10 fetch next rows only",
            throws: /unexpected fetch, limit already exists/,
            target: "fetch"
        });

    });

});