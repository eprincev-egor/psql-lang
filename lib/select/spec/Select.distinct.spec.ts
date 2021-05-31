import { Sql } from "../../Sql";
import { Select } from "../Select";

describe("Select.distinct.spec.ts: select distinct ... ", () => {

    it("valid inputs", () => {

        Sql.assertNode(Select, {
            input: "select distinct name from users",
            shouldBe: {
                json: {
                    distinct: {all: true},
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
                pretty: "select distinct\n    name\nfrom users",
                minify: "select distinct name from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select distinct on (name) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {column: [
                            {name: "name"}
                        ]}
                    ]},
                    select: [
                        {expression: {
                            column: [{name: "id"}]
                        }},
                        {expression: {
                            column: [{name: "note"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select distinct on (name)\n    id,\n    note\nfrom users",
                minify: "select distinct on(name)id,note from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select distinct on (2) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {number: "2"}
                    ]},
                    select: [
                        {expression: {
                            column: [{name: "id"}]
                        }},
                        {expression: {
                            column: [{name: "note"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select distinct on (2)\n    id,\n    note\nfrom users",
                minify: "select distinct on(2)id,note from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select distinct on (1, 2) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {number: "1"},
                        {number: "2"}
                    ]},
                    select: [
                        {expression: {
                            column: [{name: "id"}]
                        }},
                        {expression: {
                            column: [{name: "note"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select distinct on (1, 2)\n    id,\n    note\nfrom users",
                minify: "select distinct on(1,2)id,note from users"
            }
        });

        Sql.assertNode(Select, {
            input: "select distinct on (id % 2, name) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {
                            left: {
                                column: [{name: "id"}]
                            },
                            operator: "%",
                            right: {number: "2"}
                        },
                        {column: [
                            {name: "name"}
                        ]}
                    ]},
                    select: [
                        {expression: {
                            column: [{name: "id"}]
                        }},
                        {expression: {
                            column: [{name: "note"}]
                        }}
                    ],
                    from: [{
                        table: {
                            name: {name: "users"}
                        }
                    }]
                },
                pretty: "select distinct on (id % 2, name)\n    id,\n    note\nfrom users",
                minify: "select distinct on(id%2,name)id,note from users"
            }
        });
    });

});