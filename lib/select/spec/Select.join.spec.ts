import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.join.spec.ts: from ... join ...", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
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
                        {expression: {
                            column: [
                                {name: "companies"},
                                {name: "id"}
                            ]
                        }},
                        {expression: {
                            column: [
                                {name: "companies"},
                                {name: "name"}
                            ]
                        }},
                        {expression: {
                            column: [
                                {name: "countries"},
                                {name: "code"}
                            ]
                        }, as: {name: "country_code"}}
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
                            on: {
                                left: {column: [
                                    {name: "countries"},
                                    {name: "id"}
                                ]},
                                operator: "=",
                                right: {column: [
                                    {name: "companies"},
                                    {name: "id_country"}
                                ]}
                            }
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

        Sql.assertNode(Select, {
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
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "right join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
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
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "inner join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
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
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
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
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "full join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
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
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "cross join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "left outer join countries on",
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
                            type: "left outer join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "left outer join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "right outer join countries on",
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
                            type: "right outer join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "right outer join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "full outer join countries on",
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
                            type: "full outer join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            on: {boolean: true}
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "full outer join countries on true"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "left join countries using (id)"
            ].join("\n"),
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        table: {
                            name: {name: "companies"}
                        },
                        joins: [{
                            type: "left join",
                            from: {table: {
                                name: {name: "countries"}
                            }},
                            using: [
                                {column: [{name: "id"}]}
                            ]
                        }]
                    }]
                },
                minify: [
                    "select from companies",
                    "left join countries using(id)"
                ].join(" ")
            }
        });

        Sql.assertNode(Select, {
            input: [
                "select",
                "from companies",
                "",
                "inner join (values",
                "    ('01', 'January'),",
                "    ('02', 'February')",
                ") as months (month_number, month_name) on true"
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
                            from: {
                                values: [
                                    {values: [
                                        {value: {string: "01"}},
                                        {value: {string: "January"}}
                                    ]},
                                    {values: [
                                        {value: {string: "02"}},
                                        {value: {string: "February"}}
                                    ]}
                                ],
                                as: {name: "months"},
                                columnAliases: [
                                    {name: "month_number"},
                                    {name: "month_name"}
                                ]
                            },
                            on: {boolean: true}
                        }]
                    }]
                },
                pretty: [
                    "select",
                    "from companies",
                    "",
                    "inner join(", // TODO: space after join
                    "    values",
                    "        ('01', 'January'),",
                    "        ('02', 'February')",
                    ") as months(month_number, month_name)on", // TODO: space before on and after months
                    "    true"
                ].join("\n"),
                minify: [
                    "select from companies",
                    "inner join(values('01','January'),('02','February'))as months(month_number,month_name)on true"
                ].join(" ")
            }
        });

    });

});