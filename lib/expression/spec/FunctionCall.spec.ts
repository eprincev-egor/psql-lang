import { assertNode } from "abstract-lang";
import { FunctionCall } from "../FunctionCall";

describe("FunctionCall", () => {

    it("valid inputs", () => {

        assertNode(FunctionCall, {
            input: "count(*)",
            shouldBe: {
                json: {
                    call: {name: {name: "count"}},
                    arguments: [
                        {allColumns: true, column: []}
                    ]
                }
            }
        });

        assertNode(FunctionCall, {
            input: "array_agg( all company.id )",
            shouldBe: {
                json: {
                    form: "all",
                    call: {name: {name: "array_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ]
                },
                minify: "array_agg(all company.id)"
            }
        });

        assertNode(FunctionCall, {
            input: "string_agg( distinct company.name, ', ' )",
            shouldBe: {
                json: {
                    form: "distinct",
                    call: {name: {name: "string_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {string: ", "}
                    ]
                },
                minify: "string_agg(distinct company.name,', ')"
            }
        });

        assertNode(FunctionCall, {
            input: "array_agg( all company.id ) filter (where company.type8=3 )",
            shouldBe: {
                json: {
                    form: "all",
                    call: {name: {name: "array_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ],
                    filter: {
                        left: {column: [
                            {name: "company"},
                            {name: "type8"}
                        ]},
                        operator: "=",
                        right: {number: "3"}
                    }
                },
                pretty: [
                    "array_agg( all company.id )",
                    "filter (",
                    "    where",
                    "        company.type8 = 3",
                    ")"
                ].join("\n"),
                minify: "array_agg(all company.id)filter(where company.type8=3)"
            }
        });

        assertNode(FunctionCall, {
            input: "array_agg( distinct company.id ) filter (where company.type8=3 )",
            shouldBe: {
                json: {
                    form: "distinct",
                    call: {name: {name: "array_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ],
                    filter: {
                        left: {column: [
                            {name: "company"},
                            {name: "type8"}
                        ]},
                        operator: "=",
                        right: {number: "3"}
                    }
                },
                pretty: [
                    "array_agg( distinct company.id )",
                    "filter (",
                    "    where",
                    "        company.type8 = 3",
                    ")"
                ].join("\n"),
                minify: "array_agg(distinct company.id)filter(where company.type8=3)"
            }
        });

        assertNode(FunctionCall, {
            input: "array_agg(company.id) filter (where company.type8=3 )",
            shouldBe: {
                json: {
                    call: {name: {name: "array_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ],
                    filter: {
                        left: {column: [
                            {name: "company"},
                            {name: "type8"}
                        ]},
                        operator: "=",
                        right: {number: "3"}
                    }
                },
                pretty: [
                    "array_agg(company.id)",
                    "filter (",
                    "    where",
                    "        company.type8 = 3",
                    ")"
                ].join("\n"),
                minify: "array_agg(company.id)filter(where company.type8=3)"
            }
        });

        assertNode(FunctionCall, {
            input: "string_agg( company.name, ', ' order by company.name)",
            shouldBe: {
                json: {
                    call: {name: {name: "string_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {string: ", "}
                    ],
                    orderBy: [{
                        expression: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        vector: "asc"
                    }]
                },
                pretty: [
                    "string_agg(",
                    "    company.name, ', '",
                    "    order by company.name asc",
                    ")"
                ].join("\n"),
                minify: "string_agg(company.name,', ' order by company.name asc)"
            }
        });

        assertNode(FunctionCall, {
            input: "string_agg( distinct company.name, ', ' order by company.name)",
            shouldBe: {
                json: {
                    form: "distinct",
                    call: {name: {name: "string_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {string: ", "}
                    ],
                    orderBy: [{
                        expression: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        vector: "asc"
                    }]
                },
                pretty: [
                    "string_agg( distinct",
                    "    company.name, ', '",
                    "    order by company.name asc",
                    ")"
                ].join("\n"),
                minify: "string_agg(distinct company.name,', ' order by company.name asc)"
            }
        });

        assertNode(FunctionCall, {
            input: "string_agg( distinct company.name, ', ' order by company.name) filter (where true)",
            shouldBe: {
                json: {
                    form: "distinct",
                    call: {name: {name: "string_agg"}},
                    arguments: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {string: ", "}
                    ],
                    orderBy: [{
                        expression: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        vector: "asc"
                    }],
                    filter: {boolean: true}
                },
                pretty: [
                    "string_agg( distinct",
                    "    company.name, ', '",
                    "    order by company.name asc",
                    ")",
                    "filter (",
                    "    where",
                    "        true",
                    ")"
                ].join("\n"),
                minify:
                    "string_agg(distinct company.name,', ' order by company.name asc)filter(where true)"
            }
        });

        assertNode(FunctionCall, {
            input: "UNNEST( ARRAY[ 1, 2 ] ) WITHIN GROUP (ORDER BY val desc))",
            shouldBe: {
                json: {
                    call: {name: {name: "unnest"}},
                    arguments: [
                        {array: [
                            {number: "1"},
                            {number: "2"}
                        ]}
                    ],
                    within: [{
                        expression: {column: [
                            {name: "val"}
                        ]},
                        vector: "desc"
                    }]
                },
                pretty: [
                    "unnest(array[1, 2])",
                    "within group (",
                    "    order by val desc",
                    ")"
                ].join("\n"),
                minify: "unnest(array[1,2])within group(order by val desc)"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(FunctionCall, {
            input: "UNNEST( ARRAY[ 1, 2 ] ORDER BY val desc ) WITHIN GROUP (ORDER BY val desc))",
            throws: /cannot use multiple ORDER BY clauses with WITHIN GROUP/,
            target: "WITHIN"
        });

    });

});