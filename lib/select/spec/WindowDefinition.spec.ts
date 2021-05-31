import { Sql } from "../../Sql";
import { WindowDefinition } from "../WindowDefinition";

describe("WindowDefinition", () => {

    it("valid inputs", () => {

        Sql.assertNode(WindowDefinition, {
            input: "parent_window",
            shouldBe: {
                json: {
                    existingWindow: {name: "parent_window"}
                }
            }
        });

        Sql.assertNode(WindowDefinition, {
            input: "partition by company.name, company.id",
            shouldBe: {
                json: {
                    partitionBy: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ]
                },
                pretty: [
                    "partition by",
                    "    company.name,",
                    "    company.id"
                ].join("\n"),
                minify: "partition by company.name,company.id"
            }
        });

        Sql.assertNode(WindowDefinition, {
            input: "order by company.name asc, company.id desc",
            shouldBe: {
                json: {
                    orderBy: [
                        {
                            expression: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]},
                            vector: "asc"
                        },
                        {
                            expression: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            vector: "desc"
                        }
                    ]
                },
                pretty: [
                    "order by",
                    "    company.name asc,",
                    "    company.id desc"
                ].join("\n"),
                minify: "order by company.name asc,company.id desc"
            }
        });

        Sql.assertNode(WindowDefinition, {
            input: "range between 1 following and 2 following",
            shouldBe: {
                json: {
                    frame: {
                        type: "range",
                        start: {
                            type: "following",
                            value: {number: "1"}
                        },
                        end: {
                            type: "following",
                            value: {number: "2"}
                        }
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinition, {
            input: "rows between 1 following and 2 following",
            shouldBe: {
                json: {
                    frame: {
                        type: "rows",
                        start: {
                            type: "following",
                            value: {number: "1"}
                        },
                        end: {
                            type: "following",
                            value: {number: "2"}
                        }
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinition, {
            input: [
                "parent_window",
                "partition by company.name, company.id",
                "order by company.name desc, company.id asc",
                "rows between current row and 100 following"
            ].join("\n"),
            shouldBe: {
                json: {
                    existingWindow: {name: "parent_window"},
                    partitionBy: [
                        {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        {column: [
                            {name: "company"},
                            {name: "id"}
                        ]}
                    ],
                    orderBy: [
                        {
                            expression: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]},
                            vector: "desc"
                        },
                        {
                            expression: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            vector: "asc"
                        }
                    ],
                    frame: {
                        type: "rows",
                        start: {
                            type: "currentRow"
                        },
                        end: {
                            type: "following",
                            value: {number: "100"}
                        }
                    }
                },
                pretty: [
                    "parent_window",
                    "partition by",
                    "    company.name,",
                    "    company.id",
                    "order by",
                    "    company.name desc,",
                    "    company.id asc",
                    "rows between current row and 100 following"
                ].join("\n"),
                minify: [
                    "parent_window",
                    "partition by company.name,company.id",
                    "order by company.name desc,company.id asc",
                    "rows between current row and 100 following"
                ].join(" ")
            }
        });

    });

});