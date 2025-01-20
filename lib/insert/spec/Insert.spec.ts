import { Sql } from "../../Sql";
import { Insert } from "../Insert";

describe("Insert.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Insert, {
            input: "insert into orders default values",
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    values: "default"
                },
                pretty: [
                    "insert into orders",
                    "default values"
                ].join("\n"),
                minify: "insert into orders default values"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into orders AS Order default values",
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    as: {name: "order"},
                    values: "default"
                },
                pretty: [
                    "insert into orders as order",
                    "default values"
                ].join("\n"),
                minify: "insert into orders as order default values"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into orders values (1,2), (3, 4)",
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    values: [
                        {values: [{value: {number: "1"}}, {value: {number: "2"}}]},
                        {values: [{value: {number: "3"}}, {value: {number: "4"}}]}
                    ]
                },
                pretty: [
                    "insert into orders",
                    "values",
                    "    (1, 2),",
                    "    (3, 4)"
                ].join("\n"),
                minify: "insert into orders values(1,2),(3,4)"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into orders (id_country) values (default)",
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    columns: [{name: "id_country"}],
                    values: [
                        {values: [{default: true}]}
                    ]
                },
                pretty: [
                    "insert into orders (",
                    "    id_country",
                    ")",
                    "values",
                    "    (default)"
                ].join("\n"),
                minify: "insert into orders(id_country)values(default)"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into orders select 1",
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    values: {
                        select: [
                            {expression: {number: "1"}}
                        ],
                        from: []
                    }
                },
                pretty: [
                    "insert into orders",
                    "select",
                    "    1"
                ].join("\n"),
                minify: "insert into orders select 1"
            }
        });

        Sql.assertNode(Insert, {
            input: "with x1 as (select 2) insert into orders select * from x1",
            shouldBe: {
                json: {
                    with: {
                        queries: [{
                            name: {name: "x1"},
                            query: {
                                select: [
                                    {expression: {number: "2"}}
                                ],
                                from: []
                            }
                        }]
                    },
                    into: {name: {name: "orders"}},
                    values: {
                        select: [
                            {expression: {allColumns: true, column: []}}
                        ],
                        from: [{table: {name: {name: "x1"}}}]
                    }
                },
                pretty: [
                    "with",
                    "    x1 as (",
                    "        select",
                    "            2",
                    "    )",
                    "insert into orders",
                    "select",
                    "    *",
                    "from x1"
                ].join("\n"),
                minify: "with x1 as(select 2)insert into orders select*from x1"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into companies (id, name) values (1, 'Test') on conflict (id) do nothing",
            shouldBe: {
                json: {
                    into: {name: {name: "companies"}},
                    columns: [
                        {name: "id"},
                        {name: "name"}
                    ],
                    values: [
                        {values: [
                            {value: {number: "1"}},
                            {value: {string: "Test"}}
                        ]}
                    ],
                    onConflict: {
                        constraint: [{column: [{name: "id"}]}],
                        do: "nothing"
                    }
                },
                pretty: [
                    "insert into companies (",
                    "    id,",
                    "    name",
                    ")",
                    "values",
                    "    (1, 'Test')",
                    "on conflict (id)",
                    "do nothing"
                ].join("\n"),
                minify: "insert into companies(id,name)values(1,'Test')on conflict(id)do nothing"
            }
        });

        Sql.assertNode(Insert, {
            input: "insert into companies (id, name) values (1, 'Test') on conflict (id) where id > 0 do nothing",
            shouldBe: {
                json: {
                    into: {name: {name: "companies"}},
                    columns: [
                        {name: "id"},
                        {name: "name"}
                    ],
                    values: [
                        {values: [
                            {value: {number: "1"}},
                            {value: {string: "Test"}}
                        ]}
                    ],
                    onConflict: {
                        constraint: [{column: [{name: "id"}]}],
                        where: {
                            left: {column: [{name: "id"}]},
                            operator: ">",
                            right: {number: "0"}
                        },
                        do: "nothing"
                    }
                },
                pretty: [
                    "insert into companies (",
                    "    id,",
                    "    name",
                    ")",
                    "values",
                    "    (1, 'Test')",
                    "on conflict (id)",
                    "where",
                    "    id > 0",
                    "",
                    "do nothing"
                ].join("\n"),
                minify: "insert into companies(id,name)values(1,'Test')on conflict(id)where id>0 do nothing"
            }
        });

        Sql.assertNode(Insert, {
            input: `insert into companies 
                (id, name) 
            values 
                (1, 'Test') 
            on conflict
                on constraint some_constraint_name
                where id > 0
            do nothing`,
            shouldBe: {
                json: {
                    into: {name: {name: "companies"}},
                    columns: [
                        {name: "id"},
                        {name: "name"}
                    ],
                    values: [
                        {values: [
                            {value: {number: "1"}},
                            {value: {string: "Test"}}
                        ]}
                    ],
                    onConflict: {
                        constraint: {name: "some_constraint_name"},
                        where: {
                            left: {column: [{name: "id"}]},
                            operator: ">",
                            right: {number: "0"}
                        },
                        do: "nothing"
                    }
                },
                pretty: [
                    "insert into companies (",
                    "    id,",
                    "    name",
                    ")",
                    "values",
                    "    (1, 'Test')",
                    "on conflict on constraint some_constraint_name",
                    "where",
                    "    id > 0",
                    "",
                    "do nothing"
                ].join("\n"),
                minify: "insert into companies(id,name)values(1,'Test')on conflict on constraint some_constraint_name where id>0 do nothing"
            }
        });

        Sql.assertNode(Insert, {
            input: `insert into companies 
                (id, name, inn) 
            values 
                (1, 'Test', '123') 
            on conflict (inn)
            do update set
                name = excluded.name`,
            shouldBe: {
                json: {
                    into: {name: {name: "companies"}},
                    columns: [
                        {name: "id"},
                        {name: "name"},
                        {name: "inn"}
                    ],
                    values: [
                        {values: [
                            {value: {number: "1"}},
                            {value: {string: "Test"}},
                            {value: {string: "123"}}
                        ]}
                    ],
                    onConflict: {
                        constraint: [{column: [{name: "inn"}]}],
                        do: {update: {
                            set: [{
                                column: {name: "name"},
                                value: {value: {column: [{name: "excluded"}, {name: "name"}]}}
                            }]
                        }}
                    }
                },
                pretty: [
                    "insert into companies (",
                    "    id,",
                    "    name,",
                    "    inn",
                    ")",
                    "values",
                    "    (1, 'Test', '123')",
                    "on conflict (inn)",
                    "do update set",
                    "    name = excluded.name"
                ].join("\n"),
                minify: "insert into companies(id,name,inn)values(1,'Test','123')on conflict(inn)do update set name=excluded.name"
            }
        });

        Sql.assertNode(Insert, {
            input: `insert into companies 
                (id, name, inn) 
            values 
                (1, 'Test', '123') 
            on conflict (inn)
            do update set
                name = excluded.name
            where name <> 'x'`,
            shouldBe: {
                json: {
                    into: {name: {name: "companies"}},
                    columns: [
                        {name: "id"},
                        {name: "name"},
                        {name: "inn"}
                    ],
                    values: [
                        {values: [
                            {value: {number: "1"}},
                            {value: {string: "Test"}},
                            {value: {string: "123"}}
                        ]}
                    ],
                    onConflict: {
                        constraint: [{column: [{name: "inn"}]}],
                        do: {update: {
                            set: [{
                                column: {name: "name"},
                                value: {value: {column: [{name: "excluded"}, {name: "name"}]}}
                            }],
                            where: {
                                left: {column: [{name: "name"}]},
                                operator: "<>",
                                right: {string: "x"}
                            }
                        }}
                    }
                },
                pretty: [
                    "insert into companies (",
                    "    id,",
                    "    name,",
                    "    inn",
                    ")",
                    "values",
                    "    (1, 'Test', '123')",
                    "on conflict (inn)",
                    "do update set",
                    "    name = excluded.name",
                    "where",
                    "    name <> 'x'"
                ].join("\n"),
                minify: "insert into companies(id,name,inn)values(1,'Test','123')on conflict(inn)do update set name=excluded.name where name<>'x'"
            }
        });

        Sql.assertNode(Insert, {
            input: `insert into orders default values
            returning *, id, id_client as client_id`,
            shouldBe: {
                json: {
                    into: {name: {name: "orders"}},
                    values: "default",
                    returning: [
                        {expression: {column: [], allColumns: true}},
                        {expression: {column: [{name: "id"}]}},
                        {expression: {column: [{name: "id_client"}]}, as: {name: "client_id"}}
                    ]
                },
                pretty: [
                    "insert into orders",
                    "default values",
                    "returning",
                    "    *,",
                    "    id,",
                    "    id_client as client_id"
                ].join("\n"),
                minify: "insert into orders default values returning*,id,id_client as client_id"
            }
        });

    });


});