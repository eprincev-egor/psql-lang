import { Sql } from "../../Sql";
import { OrderByItem } from "../OrderByItem";

describe("OrderByItem", () => {

    it("valid inputs", () => {

        Sql.assertNode(OrderByItem, {
            input: "id",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "asc"
                },
                pretty: "id asc",
                minify: "id asc"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id asc",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "asc"
                }
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id desc",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "desc"
                }
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id desc",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "desc"
                }
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id using >",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "desc"
                },
                pretty: "id desc",
                minify: "id desc"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id using <",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "asc"
                },
                pretty: "id asc",
                minify: "id asc"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "name nulls first",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "name"}
                        ]
                    },
                    vector: "asc",
                    nulls: "first"
                },
                pretty: "name asc nulls first",
                minify: "name asc nulls first"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "name nulls last",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "name"}
                        ]
                    },
                    vector: "asc",
                    nulls: "last"
                },
                pretty: "name asc nulls last",
                minify: "name asc nulls last"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "name desc nulls last",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "name"}
                        ]
                    },
                    vector: "desc",
                    nulls: "last"
                },
                pretty: "name desc nulls last",
                minify: "name desc nulls last"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "name asc nulls last",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "name"}
                        ]
                    },
                    vector: "asc",
                    nulls: "last"
                },
                pretty: "name asc nulls last",
                minify: "name asc nulls last"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "name asc nulls first",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "name"}
                        ]
                    },
                    vector: "asc",
                    nulls: "first"
                },
                pretty: "name asc nulls first",
                minify: "name asc nulls first"
            }
        });

        Sql.assertNode(OrderByItem, {
            input: "id using < nulls first",
            shouldBe: {
                json: {
                    expression: {
                        column: [
                            {name: "id"}
                        ]
                    },
                    vector: "asc",
                    nulls: "first"
                },
                pretty: "id asc nulls first",
                minify: "id asc nulls first"
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(OrderByItem, {
            input: "id using >=",
            throws: /Ordering operators must be "<" or ">" members of btree operator families/,
            target: ">"
        });

        Sql.assertNode(OrderByItem, {
            input: "name nulls wrong",
            throws: /nulls must be "first" or "last"/,
            target: "wrong"
        });

    });

});