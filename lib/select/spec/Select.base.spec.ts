import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.base.spec.ts: base select variants", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select",
            shouldBe: {
                json: {
                    select: [],
                    from: []
                }
            }
        });

        Sql.assertNode(Select, {
            input: "select 1",
            shouldBe: {
                json: {
                    select: [{
                        expression: {number: "1"}
                    }],
                    from: []
                },
                pretty: "select\n    1"
            }
        });

        Sql.assertNode(Select, {
            input: "select 1, 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {number: "1"}},
                        {expression: {number: "2"}}
                    ],
                    from: []
                },
                pretty: "select\n    1,\n    2",
                minify: "select 1,2"
            }
        });

        Sql.assertNode(Select, {
            input: "select name from users",
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
                pretty: "select\n    name\nfrom users"
            }
        });

        Sql.assertNode(Select, {
            input: "select user.name from public.users as user",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [
                                {name: "user"},
                                {name: "name"}
                            ]
                        }}
                    ],
                    from: [{
                        table: {
                            schema: {name: "public"},
                            name: {name: "users"}
                        },
                        as: {name: "user"}
                    }]
                },
                pretty: "select\n    user.name\nfrom public.users as user"
            }
        });

        Sql.assertNode(Select, {
            input: "select * from users",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            column: [],
                            allColumns: true
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    *\nfrom users",
                minify: "select*from users"
            }
        });

        Sql.assertNode(Select, {
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

        Sql.assertNode(Select, {
            input: "select name nm from users",
            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {
                                column: [{name: "name"}]
                            },
                            as: {name: "nm"}
                        }
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    name as nm\nfrom users",
                minify: "select name as nm from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select name \"NM\" from users",
            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {
                                column: [{name: "name"}]
                            },
                            as: {strictName: "NM"}
                        }
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    name as \"NM\"\nfrom users",
                minify: "select name as \"NM\" from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 \"NM\" from users",
            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {number: "1"},
                            as: {strictName: "NM"}
                        }
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select\n    1 as \"NM\"\nfrom users",
                minify: "select 1 as \"NM\" from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select from users u",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "users"}
                        },
                        as: {name: "u"}
                    }]
                },
                pretty: "select\nfrom users as u",
                minify: "select from users as u"
            }
        });

        Sql.assertNode(Select, {
            // WARNING defaultсoef has cyrillic "с"
            input: "select defaultсoef.name::DECIMAL as defaultсoef, 1",

            shouldBe: {
                json: {
                    select: [
                        {
                            expression: {
                                cast: {
                                    column: [
                                        {name: "defaultсoef"},
                                        {name: "name"}
                                    ]
                                },
                                to: {type: "decimal"}
                            },
                            as: {name: "defaultсoef"}
                        },
                        {
                            expression: {number: "1"}
                        }
                    ],
                    from: []
                },
                pretty: "select\n    defaultсoef.name::decimal as defaultсoef,\n    1",
                minify: "select defaultсoef.name::decimal as defaultсoef,1"
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(Select, {
            input: "select from .",
            throws: /expected from item/,
            target: "."
        });

    });

});