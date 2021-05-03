import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.join.spec.ts: from ... join ...", () => {

    it("valid inputs", () => {

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

    });

});