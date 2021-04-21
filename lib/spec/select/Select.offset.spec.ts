import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.offset.spec.ts: offset/limit/...", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select name from users limit 10",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    limit: {operand: {
                        number: "10"
                    }}
                },
                pretty: "select\n    name\nfrom users\nlimit 10"
            }
        });

        assertNode(Select, {
            input: "select name from users limit all",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
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

        assertNode(Select, {
            input: "select name from users offset 10",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    offset: {operand: {
                        number: "10"
                    }}
                },
                pretty: "select\n    name\nfrom users\noffset 10"
            }
        });

        assertNode(Select, {
            input: "select name from users offset 1000 limit 120",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    offset: {operand: {
                        number: "1000"
                    }},
                    limit: {operand: {
                        number: "120"
                    }}
                },
                pretty: "select\n    name\nfrom users\noffset 1000\nlimit 120"
            }
        });

        assertNode(Select, {
            input: "select name from users limit 120 offset 1000",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    offset: {operand: {
                        number: "1000"
                    }},
                    limit: {operand: {
                        number: "120"
                    }}
                },
                pretty: "select\n    name\nfrom users\noffset 1000\nlimit 120",
                minify: "select name from users offset 1000 limit 120"
            }
        });

        assertNode(Select, {
            input: "select name from users fetch first 100 rows only",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    fetch: {
                        type: "first",
                        count: {operand: {number: "100"}}
                    }
                },
                pretty: "select\n    name\nfrom users\nfetch first 100 rows only"
            }
        });

        assertNode(Select, {
            input: "select name from users fetch next 1 row only",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    fetch: {
                        type: "next",
                        count: {operand: {number: "1"}}
                    }
                },
                pretty: "select\n    name\nfrom users\nfetch next 1 rows only",
                minify: "select name from users fetch next 1 rows only"
            }
        });

        assertNode(Select, {
            input: "select name from users fetch next row only",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
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

        assertNode(Select, {
            input: "select name from users offset 10 fetch next row only",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    offset: {operand: {number: "10"}},
                    fetch: {type: "next"}
                },
                pretty: "select\n    name\nfrom users\noffset 10\nfetch next rows only",
                minify: "select name from users offset 10 fetch next rows only"
            }
        });

        assertNode(Select, {
            input: "select name from users offset 10 - 3 fetch next row only",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    offset: {operand: {
                        left: {number: "10"},
                        operator: "-",
                        right: {number: "3"}
                    }},
                    fetch: {type: "next"}
                },
                pretty: "select\n    name\nfrom users\noffset 10 - 3\nfetch next rows only",
                minify: "select name from users offset 10-3 fetch next rows only"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Select, {
            input: "select * from users limit 10 limit 20",
            throws: /duplicated limit/,
            target: "limit"
        });

        assertNode(Select, {
            input: "select * from users limit 10 offset 1 limit 20",
            throws: /duplicated limit/,
            target: "limit"
        });

        assertNode(Select, {
            input: "select * from users offset 10 offset 20",
            throws: /duplicated offset/,
            target: "offset"
        });

        assertNode(Select, {
            input: "select * from users offset 10 limit 4 offset 20",
            throws: /duplicated offset/,
            target: "offset"
        });

        assertNode(Select, {
            input: "select * from users fetch next rows only limit 10",
            throws: /unexpected limit, fetch already exists/,
            target: "limit"
        });

        assertNode(Select, {
            input: "select * from users limit 10 fetch next rows only",
            throws: /unexpected fetch, limit already exists/,
            target: "fetch"
        });

    });

});