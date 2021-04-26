import { assertNode } from "abstract-lang";
import { Select } from "../../Select";

describe("Select.distinct.spec.ts: select distinct ... ", () => {

    it("valid inputs", () => {

        assertNode(Select, {
            input: "select distinct name from users",
            shouldBe: {
                json: {
                    distinct: {all: true},
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
                pretty: "select distinct\n    name\nfrom users",
                minify: "select distinct name from users"
            }
        });

        assertNode(Select, {
            input: "select distinct on (name) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {operand: {
                            column: [{name: "name"}]
                        }}
                    ]},
                    select: [
                        {expression: {operand: {
                            column: [{name: "id"}]
                        }}},
                        {expression: {operand: {
                            column: [{name: "note"}]
                        }}}
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

        assertNode(Select, {
            input: "select distinct on (2) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {operand: {
                            number: "2"
                        }}
                    ]},
                    select: [
                        {expression: {operand: {
                            column: [{name: "id"}]
                        }}},
                        {expression: {operand: {
                            column: [{name: "note"}]
                        }}}
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

        assertNode(Select, {
            input: "select distinct on (1, 2) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {operand: {
                            number: "1"
                        }},
                        {operand: {
                            number: "2"
                        }}
                    ]},
                    select: [
                        {expression: {operand: {
                            column: [{name: "id"}]
                        }}},
                        {expression: {operand: {
                            column: [{name: "note"}]
                        }}}
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

        assertNode(Select, {
            input: "select distinct on (id % 2, name) id, note from users",
            shouldBe: {
                json: {
                    distinct: {on: [
                        {operand: {
                            left: {
                                column: [{name: "id"}]
                            },
                            operator: "%",
                            right: {number: "2"}
                        }},
                        {operand: {
                            column: [{name: "name"}]
                        }}
                    ]},
                    select: [
                        {expression: {operand: {
                            column: [{name: "id"}]
                        }}},
                        {expression: {operand: {
                            column: [{name: "note"}]
                        }}}
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