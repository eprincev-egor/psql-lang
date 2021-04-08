/* eslint-disable sonarjs/no-duplicate-string */
import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "100",
            shouldBe: {
                json: {
                    operand: {number: "100"}
                }
            }
        });

        assertNode(Expression, {
            input: "-4",
            shouldBe: {
                json: {
                    operand: {number: "-4"}
                }
            }
        });

        assertNode(Expression, {
            input: "'string'",
            shouldBe: {
                json: {
                    operand: {string: "string"}
                }
            }
        });

        assertNode(Expression, {
            input: "E'Estring'",
            shouldBe: {
                json: {
                    operand: {string: "Estring", escape: true}
                }
            }
        });

        assertNode(Expression, {
            input: "U&'Ustring'",
            shouldBe: {
                json: {
                    operand: {string: "Ustring", unicodeEscape: "\\"}
                }
            }
        });

        assertNode(Expression, {
            input: "$dol1lar$dollar\nstring$dol1lar$",
            shouldBe: {
                json: {
                    operand: {string: "dollar\nstring", tag: "dol1lar"}
                }
            }
        });

        assertNode(Expression, {
            input: "company.inn",
            shouldBe: {
                json: {
                    operand: {column: [
                        {name: "company"},
                        {name: "inn"}
                    ]}
                }
            }
        });

        assertNode(Expression, {
            input: "false",
            shouldBe: {
                json: {
                    operand: {boolean: false}
                }
            }
        });

        assertNode(Expression, {
            input: "null",
            shouldBe: {
                json: {
                    operand: {null: true}
                }
            }
        });

        assertNode(Expression, {
            input: "$lang",
            shouldBe: {
                json: {
                    operand: {variable: "lang"}
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "orders.incoming_date is not null",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "incoming_date"}
                        ]},
                        postOperator: "is not null"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "orders.incoming_date is null",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "incoming_date"}
                        ]},
                        postOperator: "is null"
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "orders.incoming_date isnull",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "incoming_date"}
                        ]},
                        postOperator: "is null"
                    }
                },
                pretty: "orders.incoming_date is null",
                minify: "orders.incoming_date is null"
            }
        });

        assertNode(Expression, {
            input: "orders.incoming_date notnull",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "incoming_date"}
                        ]},
                        postOperator: "is not null"
                    }
                },
                pretty: "orders.incoming_date is not null",
                minify: "orders.incoming_date is not null"
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "@ -1",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "@",
                        operand: {number: "-1"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "+ -1",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "+",
                        operand: {number: "-1"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "- + -1",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "-",
                        operand: {
                            preOperator: "+",
                            operand: {number: "-1"}
                        }
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "-   +   -.2",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "-",
                        operand: {
                            preOperator: "+",
                            operand: {number: "-.2"}
                        }
                    }
                },
                minify: "- + -.2",
                pretty: "- + -.2"
            }
        });

        assertNode(Expression, {
            input: "not true",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "not",
                        operand: {boolean: true}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "NOT  \t\n  NOT \r   TRUE",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "not",
                        operand: {
                            preOperator: "not",
                            operand: {boolean: true}
                        }
                    }
                },
                pretty: "not not true",
                minify: "not not true"
            }
        });

        assertNode(Expression, {
            input: "not true or not false",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "not",
                            operand: {boolean: true}
                        },
                        operator: "or",
                        right: {
                            preOperator: "not",
                            operand: {boolean: false}
                        }
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "not false and not true",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "not",
                            operand: {boolean: false}
                        },
                        operator: "and",
                        right: {
                            preOperator: "not",
                            operand: {boolean: true}
                        }
                    }
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "company.name ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name not ilike '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not ilike",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "company.name not like '%hello%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        operator: "not like",
                        right: {string: "%hello%"}
                    }
                }
            }
        });

        assertNode(Expression, {
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

        assertNode(Expression, {
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

        assertNode(Expression, {
            input: "(1 + 2) - (3 + 4)",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operand: {
                                left: {number: "1"},
                                operator: "+",
                                right: {number: "2"}
                            }
                        },
                        operator: "-",
                        right: {
                            operand: {
                                left: {number: "3"},
                                operator: "+",
                                right: {number: "4"}
                            }
                        }
                    }
                },
                minify: "(1+2)-(3+4)"
            }
        });

        assertNode(Expression, {
            input: "orders.type in (1, 2)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        in: [
                            {operand: {number: "1"}},
                            {operand: {number: "2"}}
                        ]
                    }
                },
                minify: "orders.type in(1,2)"
            }
        });

        assertNode(Expression, {
            input: "orders.type not in (3, 4, 5)",
            shouldBe: {
                json: {
                    operand: {
                        operand: {column: [
                            {name: "orders"},
                            {name: "type"}
                        ]},
                        notIn: [
                            {operand: {number: "3"}},
                            {operand: {number: "4"}},
                            {operand: {number: "5"}}
                        ]
                    }
                },
                minify: "orders.type not in(3,4,5)"
            }
        });

        assertNode(Expression, {
            input: "ARRAY[1,2,3]",
            shouldBe: {
                json: {
                    operand: {array: [
                        {operand: {number: "1"}},
                        {operand: {number: "2"}},
                        {operand: {number: "3"}}
                    ]}
                },
                pretty: "array[1, 2, 3]",
                minify: "array[1,2,3]"
            }
        });

        assertNode(Expression, {
            input: "ARRAY[1,2] || ARRAY[ 3, 4 ] || ARRAY[5, 6]",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {array: [
                                {operand: {number: "1"}},
                                {operand: {number: "2"}}
                            ]},
                            operator: "||",
                            right: {array: [
                                {operand: {number: "3"}},
                                {operand: {number: "4"}}
                            ]}
                        },
                        operator: "||",
                        right: {array: [
                            {operand: {number: "5"}},
                            {operand: {number: "6"}}
                        ]}
                    }
                },
                pretty: "array[1, 2] || array[3, 4] || array[5, 6]",
                minify: "array[1,2]||array[3,4]||array[5,6]"
            }
        });

        assertNode(Expression, {
            input: "case when true then 1 else 0 end",
            shouldBe: {
                json: {
                    operand: {
                        case: [{
                            when: {operand: {boolean: true}},
                            then: {operand: {number: "1"}}
                        }],
                        else: {operand: {number: "0"}}
                    }
                },
                pretty: [
                    "case",
                    "    when true",
                    "    then 1",
                    "    else 0",
                    "end"
                ].join("\n")
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Expression, {
            input: "::",
            throws: /expected expression operand/
        });

    });

});