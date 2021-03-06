import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.union.spec.ts: select ... union select ...", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select 1 union select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 intersect select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "intersect",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "intersect",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 except select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "except",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "except",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 union all select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        option: "all",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union all",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 union distinct select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        option: "distinct",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union distinct",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 intersect distinct select 2",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "intersect",
                        option: "distinct",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: []
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "intersect distinct",
                    "select",
                    "    2"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 union select 2 union select 3",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: [],
                            union: {
                                type: "union",
                                select: {
                                    select: [
                                        {expression: {
                                            number: "3"
                                        }}
                                    ],
                                    from: []
                                }
                            }
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union",
                    "select",
                    "    2",
                    "union",
                    "select",
                    "    3"
                ].join("\n")
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 union (select 2)",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: [],
                            bracketsBeforeSelect: 1
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union",
                    "(select",
                    "    2)"
                ].join("\n"),
                minify: "select 1 union(select 2)"
            }
        });

        Sql.assertNode(Select, {
            input: "select 1 union (((select 2)))",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: [],
                            bracketsBeforeSelect: 3
                        }
                    }
                },
                pretty: [
                    "select",
                    "    1",
                    "union",
                    "(((select",
                    "    2)))"
                ].join("\n"),
                minify: "select 1 union(((select 2)))"
            }
        });

        Sql.assertNode(Select, {
            input: "(select 1) union(select 2)",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    from: [],
                    bracketsBeforeSelect: 1,
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: [],
                            bracketsBeforeSelect: 1
                        }
                    }
                },
                pretty: [
                    "(select",
                    "    1)",
                    "union",
                    "(select",
                    "    2)"
                ].join("\n"),
                minify: "(select 1)union(select 2)"
            }
        });

        Sql.assertNode(Select, {
            input: "(((select 1))) union ((select 2))",
            shouldBe: {
                json: {
                    select: [
                        {expression: {
                            number: "1"
                        }}
                    ],
                    bracketsBeforeSelect: 3,
                    from: [],
                    union: {
                        type: "union",
                        select: {
                            select: [
                                {expression: {
                                    number: "2"
                                }}
                            ],
                            from: [],
                            bracketsBeforeSelect: 2
                        }
                    }
                },
                pretty: [
                    "(((select",
                    "    1)))",
                    "union",
                    "((select",
                    "    2))"
                ].join("\n"),
                minify: "(((select 1)))union((select 2))"
            }
        });

    });

});