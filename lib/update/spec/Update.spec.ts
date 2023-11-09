import { Sql } from "../../Sql";
import { Update } from "../Update";

describe("Update.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Update, {
            input: "update companies set name = 'nice'",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "update companies set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies as company set name = 'nice'",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    as: {name: "company"},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies as company set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "update companies as company set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set name = 'nice' where name = 'old'",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    where: {
                        left: {column: [{name: "name"}]},
                        operator: "=",
                        right: {string: "old"}
                    },
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    name = 'nice'",
                    "where",
                    "    name = 'old'",
                    ""
                ].join("\n"),
                minify: "update companies set name='nice' where name='old'"
            }
        });

        Sql.assertNode(Update, {
            input: "update only companies set name = 'nice'",
            shouldBe: {
                json: {
                    all: false,
                    only: true,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update only companies set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "update only companies set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies * set name = 'nice'",
            shouldBe: {
                json: {
                    all: true,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies * set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "update companies * set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update only companies * set name = 'nice'",
            shouldBe: {
                json: {
                    all: true,
                    only: true,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update only companies * set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "update only companies * set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set name = 'nice', note = 'hello'",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }, {
                        column: {name: "note"},
                        value: {value: {string: "hello"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    name = 'nice',",
                    "    note = 'hello'",
                    ""
                ].join("\n"),
                minify: "update companies set name='nice',note='hello'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set (name, note) = ('hello', 'world')",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        columns: [
                            {name: "name"},
                            {name: "note"}
                        ],
                        values: [
                            {value: {string: "hello"}},
                            {value: {string: "world"}}
                        ]
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    (",
                    "        name,",
                    "        note",
                    "    ) = (",
                    "        'hello',",
                    "        'world'",
                    "    )",
                    ""
                ].join("\n"),
                minify: "update companies set(name,note)=('hello','world')"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set (name, note) = ('hello', 'world'), a = 1",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        columns: [
                            {name: "name"},
                            {name: "note"}
                        ],
                        values: [
                            {value: {string: "hello"}},
                            {value: {string: "world"}}
                        ]
                    }, {
                        column: {name: "a"},
                        value: {value: {number: "1"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    (",
                    "        name,",
                    "        note",
                    "    ) = (",
                    "        'hello',",
                    "        'world'",
                    "    ),",
                    "    a = 1",
                    ""
                ].join("\n"),
                minify: "update companies set(name,note)=('hello','world'),a=1"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set (name) = (select 'hello')",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        columns: [
                            {name: "name"}
                        ],
                        select: {
                            select: [{
                                expression: {string: "hello"}
                            }],
                            from: []
                        }
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    (",
                    "        name",
                    "    ) = (",
                    "        select",
                    "            'hello'",
                    "    )",
                    ""
                ].join("\n"),
                minify: "update companies set(name)=(select 'hello')"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set (name) = (select 'hello'), a = 1",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        columns: [
                            {name: "name"}
                        ],
                        select: {
                            select: [{
                                expression: {string: "hello"}
                            }],
                            from: []
                        }
                    }, {
                        column: {name: "a"},
                        value: {value: {number: "1"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    (",
                    "        name",
                    "    ) = (",
                    "        select",
                    "            'hello'",
                    "    ),",
                    "    a = 1",
                    ""
                ].join("\n"),
                minify: "update companies set(name)=(select 'hello'),a=1"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set name = 'nice' from orders",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [{table: {name: {name: "orders"}}}],
                    returning: []
                },
                pretty: [
                    "update companies set",
                    "    name = 'nice'",
                    "from orders",
                    ""
                ].join("\n"),
                minify: "update companies set name='nice' from orders"
            }
        });

        Sql.assertNode(Update, {
            input: "with cte as (select 1) update companies set name = 'nice'",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    with: {
                        queries: [{
                            name: {name: "cte"},
                            query: {
                                select: [{expression: {number: "1"}}],
                                from: []
                            }
                        }]
                    },
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: []
                },
                pretty: [
                    "with",
                    "    cte as (",
                    "        select",
                    "            1",
                    "    )",
                    "update companies set",
                    "    name = 'nice'",
                    ""
                ].join("\n"),
                minify: "with cte as(select 1)update companies set name='nice'"
            }
        });

        Sql.assertNode(Update, {
            input: "update companies set name = 'nice' returning id",
            shouldBe: {
                json: {
                    all: false,
                    only: false,
                    update: {name: {name: "companies"}},
                    set: [{
                        column: {name: "name"},
                        value: {value: {string: "nice"}}
                    }],
                    from: [],
                    returning: [{
                        expression: {column: [{name: "id"}]}
                    }]
                },
                pretty: [
                    "update companies set",
                    "    name = 'nice'",
                    "returning id"
                ].join("\n"),
                minify: "update companies set name='nice' returning id"
            }
        });

    });


});