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
                        when: {
                            operand: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]},
                            postOperator: "is not null"
                        },
                        then: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]}
                    }],
                    else: {string: "(unknown)"}
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
                            when: {
                                operand: {column: [
                                    {name: "company"},
                                    {name: "name"}
                                ]},
                                postOperator: "is not null"
                            },
                            then: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]}
                        },
                        {
                            when: {
                                operand: {column: [
                                    {name: "company"},
                                    {name: "name_eng"}
                                ]},
                                postOperator: "is not null"
                            },
                            then: {column: [
                                {name: "company"},
                                {name: "name_eng"}
                            ]}
                        }
                    ],
                    else: {string: "(unknown)"}
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
                        when: {boolean: true},
                        then: {number: "1"}
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
                    switch: {column: [
                        {name: "order"},
                        {name: "type"}
                    ]},
                    case: [{
                        when: {string: "FTL"},
                        then: {string: "green"}
                    }],
                    else: {string: "red"}
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
                    switch: {column: [
                        {name: "order"},
                        {name: "type"}
                    ]},
                    case: [{
                        when: {string: "FCL"},
                        then: {string: "black"}
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