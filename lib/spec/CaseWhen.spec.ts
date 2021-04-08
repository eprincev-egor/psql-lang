import { assertNode } from "abstract-lang";
import { CaseWhen } from "../CaseWhen";

describe("CaseWhen", () => {

    it("valid inputs", () => {

        assertNode(CaseWhen, {
            input: `case
                when company.name is not null
                then company.name
                else '(unknown)'
            end
            `,
            shouldBe: {
                json: {
                    case: [{
                        when: {operand: {
                            operand: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]},
                            postOperator: "is not null"
                        }},
                        then: {operand: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]}}
                    }],
                    else: {operand: {
                        string: "(unknown)"
                    }}
                },
                pretty: [
                    "case",
                    "    when company.name is not null",
                    "    then company.name",
                    "    else '(unknown)'",
                    "end"
                ].join("\n"),
                minify: "case when company.name is not null then company.name else '(unknown)' end"
            }
        });

        assertNode(CaseWhen, {
            input: `case
                when company.name is not null
                then company.name
                
                when company.name_eng is not null
                then company.name_eng

                else '(unknown)'
            end
            `,
            shouldBe: {
                json: {
                    case: [
                        {
                            when: {operand: {
                                operand: {column: [
                                    {name: "company"},
                                    {name: "name"}
                                ]},
                                postOperator: "is not null"
                            }},
                            then: {operand: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]}}
                        },
                        {
                            when: {operand: {
                                operand: {column: [
                                    {name: "company"},
                                    {name: "name_eng"}
                                ]},
                                postOperator: "is not null"
                            }},
                            then: {operand: {column: [
                                {name: "company"},
                                {name: "name_eng"}
                            ]}}
                        }
                    ],
                    else: {operand: {
                        string: "(unknown)"
                    }}
                },
                pretty: [
                    "case",
                    "    when company.name is not null",
                    "    then company.name",
                    "    when company.name_eng is not null",
                    "    then company.name_eng",
                    "    else '(unknown)'",
                    "end"
                ].join("\n"),
                minify: [
                    "case",
                    "when company.name is not null",
                    "then company.name",
                    "when company.name_eng is not null",
                    "then company.name_eng",
                    "else '(unknown)'",
                    "end"
                ].join(" ")
            }
        });

        assertNode(CaseWhen, {
            input: `case
                when true
                then 1
            end
            `,
            shouldBe: {
                json: {
                    case: [{
                        when: {operand: {boolean: true}},
                        then: {operand: {number: "1"}}
                    }]
                },
                pretty: [
                    "case",
                    "    when true",
                    "    then 1",
                    "end"
                ].join("\n"),
                minify: "case when true then 1 end"
            }
        });

        assertNode(CaseWhen, {
            input: `case order.type
                when 'FTL'
                then 'green'
                else 'red'
            end
            `,
            shouldBe: {
                json: {
                    switch: {operand: {column: [
                        {name: "order"},
                        {name: "type"}
                    ]}},
                    case: [{
                        when: {operand: {string: "FTL"}},
                        then: {operand: {string: "green"}}
                    }],
                    else: {operand: {string: "red"}}
                },
                pretty: [
                    "case order.type",
                    "    when 'FTL'",
                    "    then 'green'",
                    "    else 'red'",
                    "end"
                ].join("\n"),
                minify: "case order.type when 'FTL' then 'green' else 'red' end"
            }
        });

        assertNode(CaseWhen, {
            input: `case order.type
                when 'FCL'
                then 'black'
            end
            `,
            shouldBe: {
                json: {
                    switch: {operand: {column: [
                        {name: "order"},
                        {name: "type"}
                    ]}},
                    case: [{
                        when: {operand: {string: "FCL"}},
                        then: {operand: {string: "black"}}
                    }]
                },
                pretty: [
                    "case order.type",
                    "    when 'FCL'",
                    "    then 'black'",
                    "end"
                ].join("\n"),
                minify: "case order.type when 'FCL' then 'black' end"
            }
        });

    });

});