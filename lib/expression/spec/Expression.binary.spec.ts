import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.binary.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "$1 > $2",
            shouldBe: {
                json: {
                    operand: {
                        left: {variable: "1"},
                        operator: ">",
                        right: {variable: "2"}
                    }
                },
                minify: "$1>$2"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 + 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "+",
                        right: {number: "2"}
                    }
                },
                minify: "1+2"
            }
        });

        Sql.assertNode(Expression, {
            input: "2 - 1",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "-",
                        right: {number: "1"}
                    }
                },
                minify: "2-1"
            }
        });

        Sql.assertNode(Expression, {
            input: "2 != 1",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "!=",
                        right: {number: "1"}
                    }
                },
                minify: "2!=1"
            }
        });

        Sql.assertNode(Expression, {
            input: "2 <> 1",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "<>",
                        right: {number: "1"}
                    }
                },
                minify: "2<>1"
            }
        });

        Sql.assertNode(Expression, {
            input: "3 ^ 5",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "^",
                        right: {number: "5"}
                    }
                },
                minify: "3^5"
            }
        });

        Sql.assertNode(Expression, {
            input: "'hello' || 'world'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "hello"},
                        operator: "||",
                        right: {string: "world"}
                    }
                },
                minify: "'hello'||'world'"
            }
        });

        Sql.assertNode(Expression, {
            input: "true > false",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: ">",
                        right: {boolean: false}
                    }
                },
                minify: "true>false"
            }
        });

        Sql.assertNode(Expression, {
            input: "true > null",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: ">",
                        right: {null: true}
                    }
                },
                minify: "true>null"
            }
        });

        Sql.assertNode(Expression, {
            input: "$variable = 4",
            shouldBe: {
                json: {
                    operand: {
                        left: {variable: "variable"},
                        operator: "=",
                        right: {number: "4"}
                    }
                },
                minify: "$variable=4"
            }
        });

        Sql.assertNode(Expression, {
            input: "$t$20 days$t$ >= interval '1 day'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "20 days", tag: "t"},
                        operator: ">=",
                        right: {interval: {string: "1 day"}}
                    }
                },
                minify: "$t$20 days$t$>=interval '1 day'"
            }
        });

        Sql.assertNode(Expression, {
            input: "company.dt_create <= interval '1 year'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "dt_create"}
                        ]},
                        operator: "<=",
                        right: {interval: {string: "1 year"}}
                    }
                },
                minify: "company.dt_create<=interval '1 year'"
            }
        });

        Sql.assertNode(Expression, {
            input: "b'0001' || x'0ffe'",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            base: "binary",
                            byteString: "0001"
                        },
                        operator: "||",
                        right: {
                            base: "hexadecimal",
                            byteString: "0ffe"
                        }
                    }
                },
                pretty: "B'0001' || X'0ffe'",
                minify: "B'0001'||X'0ffe'"
            }
        });

        Sql.assertNode(Expression, {
            input: "E'hello' || U&'world'",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "hello", escape: true},
                        operator: "||",
                        right: {string: "world", unicodeEscape: "\\"}
                    }
                },
                minify: "E'hello'||U&'world'"
            }
        });

        Sql.assertNode(Expression, {
            input: "true or false",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: "or",
                        right: {boolean: false}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "FALSE \r OR \n TRUE",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: false},
                        operator: "or",
                        right: {boolean: true}
                    }
                },
                minify: "false or true",
                pretty: "false or true"
            }
        });

        Sql.assertNode(Expression, {
            input: "true and false",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: "and",
                        right: {boolean: false}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "FALSE \n AND \t\r TRUE",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: false},
                        operator: "and",
                        right: {boolean: true}
                    }
                },
                minify: "false and true",
                pretty: "false and true"
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name is distinct from 'hello'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "is distinct from",
                        right: {string: "hello"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "company.name is not distinct from 'hello'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "is not distinct from",
                        right: {string: "hello"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "1 + 2 + 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "1"},
                            operator: "+",
                            right: {number: "2"}
                        },
                        operator: "+",
                        right: {number: "3"}
                    }
                },
                minify: "1+2+3"
            }
        });

        Sql.assertNode(Expression, {
            input: "1 +2 + 3+4",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {
                                left: {number: "1"},
                                operator: "+",
                                right: {number: "2"}
                            },
                            operator: "+",
                            right: {number: "3"}
                        },
                        operator: "+",
                        right: {number: "4"}
                    }
                },
                minify: "1+2+3+4",
                pretty: "1 + 2 + 3 + 4"
            }
        });

        Sql.assertNode(Expression, {
            input: "ARRAY[1,2] || ARRAY[ 3, 4 ] || ARRAY[5, 6]",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {array: [
                                {number: "1"},
                                {number: "2"}
                            ]},
                            operator: "||",
                            right: {array: [
                                {number: "3"},
                                {number: "4"}
                            ]}
                        },
                        operator: "||",
                        right: {array: [
                            {number: "5"},
                            {number: "6"}
                        ]}
                    }
                },
                pretty: "array[1, 2] || array[3, 4] || array[5, 6]",
                minify: "array[1,2]||array[3,4]||array[5,6]"
            }
        });

        Sql.assertNode(Expression, {
            input: `coalesce('test' || case
                when company.name is not null
                then company.name
                else '(unknown)'
            end, '')
            `,
            shouldBe: {
                json: {
                    operand: {
                        call: {
                            name: {name: "coalesce"}
                        },
                        arguments: [
                            {
                                left: {string: "test"},
                                operator: "||",
                                right: {
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
                                }
                            },
                            {string: ""}
                        ]
                    }
                },
                pretty: [
                    "coalesce('test' || case",
                    "    when company.name is not null",
                    "    then company.name",
                    "    else '(unknown)'",
                    "end, '')"
                ].join("\n"),
                minify: "coalesce('test'||case when company.name is not null then company.name else '(unknown)' end,'')"
            }
        });

    });

});