import { assertNode } from "abstract-lang";
import { Select } from "../Select";

describe("Select", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select",
            shouldBe: {
                json: {
                    select: [],
                    from: []
                }
            }
        });

        assertNode(Select, {
            input: "select 1",
            shouldBe: {
                json: {
                    select: [{
                        expression: {operand: {number: "1"}}
                    }],
                    from: []
                },
                pretty: "select\n    1"
            }
        });

        assertNode(Select, {
            input: "select 1, 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            number: "1"
                        }}},
                        {expression: {operand: {
                            number: "2"
                        }}}
                    ],
                    from: []
                },
                pretty: "select\n    1,\n    2",
                minify: "select 1,2"
            }
        });

        assertNode(Select, {
            input: "select name from users",
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
                pretty: "select\n    name\nfrom users"
            }
        });

        assertNode(Select, {
            input: "select from users, companies",
            shouldBe: {
                json: {
                    select: [],
                    from: [
                        {table: {
                            name: {name: "users"}
                        }},
                        {table: {
                            name: {name: "companies"}
                        }}
                    ]
                },
                pretty: "select\nfrom users, companies",
                minify: "select from users,companies"
            }
        });

        assertNode(Select, {
            input: "select name from users where users.name is not null",
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
                    where: {operand: {
                        operand: {column: [
                            {name: "users"},
                            {name: "name"}
                        ]},
                        postOperator: "is not null"
                    }}
                },
                pretty: [
                    "select",
                    "    name",
                    "from users",
                    "where",
                    "    users.name is not null"
                ].join("\n")
            }
        });

        assertNode(Select, {
            input: "select 1 where false",
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            number: "1"
                        }}}
                    ],
                    from: [],
                    where: {operand: {
                        boolean: false
                    }}
                },
                pretty: [
                    "select",
                    "    1",
                    "where",
                    "    false"
                ].join("\n")
            }
        });

        assertNode(Select, {
            input: "select id from (select 1 as id) as tmp",
            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {operand: {
                                column: [
                                    {name: "id"}
                                ]
                            }}
                        }
                    ],
                    from: [{
                        subQuery: {
                            select: [
                                {
                                    expression: {operand: {
                                        number: "1"
                                    }},
                                    as: {name: "id"}
                                }
                            ],
                            from: []
                        },
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "    id",
                    "from (",
                    "    select",
                    "        1 as id",
                    ") as tmp"
                ].join("\n"),
                minify: "select id from(select 1 as id)as tmp"
            }
        });

        assertNode(Select, {
            input: "select name from users order by id",
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
                    orderBy: [{
                        expression: {operand: {
                            column: [
                                {name: "id"}
                            ]
                        }},
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
                        {expression: {operand: {
                            column: [{name: "name"}]
                        }}}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }],
                    orderBy: [{
                        expression: {operand: {
                            column: [
                                {name: "id"}
                            ]
                        }},
                        vector: "desc"
                    }]
                },
                pretty: "select\n    name\nfrom users\norder by id desc"
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "    companies.id,",
                "    companies.name,",
                "    countries.code as country_code",
                "from companies",
                "",
                "left join countries on",
                "    countries.id = companies.id_country"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [
                        {expression: {operand: {
                            column: [
                                {name: "companies"},
                                {name: "id"}
                            ]
                        }}},
                        {expression: {operand: {
                            column: [
                                {name: "companies"},
                                {name: "name"}
                            ]
                        }}},
                        {expression: {operand: {
                            column: [
                                {name: "countries"},
                                {name: "code"}
                            ]
                        }}, as: {name: "country_code"}}
                    ],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "left join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                left: {column: [
                                    {name: "countries"},
                                    {name: "id"}
                                ]},
                                operator: "=",
                                right: {column: [
                                    {name: "companies"},
                                    {name: "id_country"}
                                ]}
                            }}
                        }]
                    }]
                },
                minify: [
                    "select companies.id,companies.name,countries.code as country_code",
                    "from companies",
                    "left join countries on",
                    "countries.id=companies.id_country"
                ].join(" ")
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "right join countries on",
                "    true"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "right join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                boolean: true
                            }}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "right join countries on true"
                ].join(" ")
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "inner join countries on",
                "    true"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "inner join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                boolean: true
                            }}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "inner join countries on true"
                ].join(" ")
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "join countries on",
                "    true"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                boolean: true
                            }}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "join countries on true"
                ].join(" ")
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "full join countries on",
                "    true"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "full join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                boolean: true
                            }}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "full join countries on true"
                ].join(" ")
            }
        });

        assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "cross join countries on",
                "    true"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "cross join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {operand: {
                                boolean: true
                            }}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "cross join countries on true"
                ].join(" ")
            }
        });

    });

});