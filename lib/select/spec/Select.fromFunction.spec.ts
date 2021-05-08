import { assertNode } from "abstract-lang";
import { Select } from "../Select";

describe("Select.fromFunction.spec.ts: select ... from func(arg, ...)", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select from unnest(array[1, 2, 3])",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "1"},
                                    {number: "2"},
                                    {number: "3"}
                                ]}
                            ]
                        }
                    }]
                },
                pretty: [
                    "select",
                    "from unnest(array[1, 2, 3])"
                ].join("\n"),
                minify: "select from unnest(array[1,2,3])"
            }
        });

        assertNode(Select, {
            input: "select from unnest(array[1, 2]) as company_id",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "1"},
                                    {number: "2"}
                                ]}
                            ]
                        },
                        as: {name: "company_id"}
                    }]
                },
                pretty: [
                    "select",
                    "from unnest(array[1, 2]) as company_id"
                ].join("\n"),
                minify: "select from unnest(array[1,2])as company_id"
            }
        });

        assertNode(Select, {
            input: "select from lateral json_each('{}'::json) as json_item",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        lateral: true,
                        function: {
                            call: {name: {name: "json_each"}},
                            arguments: [
                                {
                                    cast: {string: "{}"},
                                    as: {type: "json"}
                                }
                            ]
                        },
                        as: {name: "json_item"}
                    }]
                },
                pretty: [
                    "select",
                    "from lateral json_each('{}'::json) as json_item"
                ].join("\n"),
                minify: "select from lateral json_each('{}'::json)as json_item"
            }
        });

        assertNode(Select, {
            input: "select from lateral json_each('{}'::json) as json_item (k, v)",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        lateral: true,
                        function: {
                            call: {name: {name: "json_each"}},
                            arguments: [
                                {
                                    cast: {string: "{}"},
                                    as: {type: "json"}
                                }
                            ]
                        },
                        as: {name: "json_item"},
                        columnAliases: [
                            {name: "k"},
                            {name: "v"}
                        ]
                    }]
                },
                pretty: [
                    "select",
                    "from lateral json_each('{}'::json) as json_item(k, v)"
                ].join("\n"),
                minify: "select from lateral json_each('{}'::json)as json_item(k,v)"
            }
        });

        assertNode(Select, {
            input: "select ordinality from unnest(array[10, 20]) with ordinality",
            shouldBe: {
                json: {
                    select: [{
                        expression: {column: [
                            {name: "ordinality"}
                        ]}
                    }],
                    from: [{
                        withOrdinality: true,
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "10"},
                                    {number: "20"}
                                ]}
                            ]
                        }
                    }]
                },
                pretty: [
                    "select",
                    "    ordinality",
                    "from unnest(array[10, 20]) with ordinality"
                ].join("\n"),
                minify: "select ordinality from unnest(array[10,20])with ordinality"
            }
        });

        assertNode(Select, {
            input: "select from lateral unnest(array[10, 20]) with ordinality",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        lateral: true,
                        withOrdinality: true,
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "10"},
                                    {number: "20"}
                                ]}
                            ]
                        }
                    }]
                },
                pretty: [
                    "select",
                    "from lateral unnest(array[10, 20]) with ordinality"
                ].join("\n"),
                minify: "select from lateral unnest(array[10,20])with ordinality"
            }
        });

        assertNode(Select, {
            input: "select from unnest(array[10, 20]) with ordinality tmp",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        withOrdinality: true,
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "10"},
                                    {number: "20"}
                                ]}
                            ]
                        },
                        as: {name: "tmp"}
                    }]
                },
                pretty: [
                    "select",
                    "from unnest(array[10, 20]) with ordinality as tmp"
                ].join("\n"),
                minify: "select from unnest(array[10,20])with ordinality as tmp"
            }
        });


        assertNode(Select, {
            input: "select from unnest(array[10, 20]) with ordinality tmp(i)",
            shouldBe: {
                json: {
                    select: [],
                    from: [{
                        withOrdinality: true,
                        function: {
                            call: {name: {name: "unnest"}},
                            arguments: [
                                {array: [
                                    {number: "10"},
                                    {number: "20"}
                                ]}
                            ]
                        },
                        as: {name: "tmp"},
                        columnAliases: [
                            {name: "i"}
                        ]
                    }]
                },
                pretty: [
                    "select",
                    "from unnest(array[10, 20]) with ordinality as tmp(i)"
                ].join("\n"),
                minify: "select from unnest(array[10,20])with ordinality as tmp(i)"
            }
        });

    });

});