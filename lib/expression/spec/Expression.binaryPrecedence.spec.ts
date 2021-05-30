import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.binaryPrecedence.spec.ts", () => {

    it("valid inputs", () => {

        assertNode(Expression, {
            input: "3 - 2 + 1",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "3"},
                            operator: "-",
                            right: {number: "2"}
                        },
                        operator: "+",
                        right: {number: "1"}
                    }
                },
                minify: "3-2+1"
            }
        });

        assertNode(Expression, {
            input: "2 + 2 * 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "+",
                        right: {
                            left: {number: "2"},
                            operator: "*",
                            right: {number: "2"}
                        }
                    }
                },
                minify: "2+2*2"
            }
        });

        assertNode(Expression, {
            input: "2 - 2 / 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "-",
                        right: {
                            left: {number: "2"},
                            operator: "/",
                            right: {number: "2"}
                        }
                    }
                },
                minify: "2-2/2"
            }
        });

        assertNode(Expression, {
            input: "1 + 5 % 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "+",
                        right: {
                            left: {number: "5"},
                            operator: "%",
                            right: {number: "2"}
                        }
                    }
                },
                minify: "1+5%2"
            }
        });

        assertNode(Expression, {
            input: "company.id > 100 or company.name is not null",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {column: [
                                {name: "company"},
                                {name: "id"}
                            ]},
                            operator: ">",
                            right: {number: "100"}
                        },
                        operator: "or",
                        right: {
                            operand: {column: [
                                {name: "company"},
                                {name: "name"}
                            ]},
                            postOperator: "is not null"
                        }
                    }
                },
                minify: "company.id>100 or company.name is not null"
            }
        });

        assertNode(Expression, {
            input: "(1 + 2) - (3 + 4)",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            subExpression: {
                                left: {number: "1"},
                                operator: "+",
                                right: {number: "2"}
                            }
                        },
                        operator: "-",
                        right: {
                            subExpression: {
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
            input: [
                "account.balance > 0",
                "and",
                "account.is_active",
                "or",
                "account.balance < 0",
                "and",
                "account.is_passive"
            ].join(" "),
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {
                                left: {column: [
                                    {name: "account"},
                                    {name: "balance"}
                                ]},
                                operator: ">",
                                right: {number: "0"}
                            },
                            operator: "and",
                            right: {column: [
                                {name: "account"},
                                {name: "is_active"}
                            ]}
                        },
                        operator: "or",
                        right: {
                            left: {
                                left: {column: [
                                    {name: "account"},
                                    {name: "balance"}
                                ]},
                                operator: "<",
                                right: {number: "0"}
                            },
                            operator: "and",
                            right: {column: [
                                {name: "account"},
                                {name: "is_passive"}
                            ]}
                        }
                    }
                },
                minify: [
                    "account.balance>0",
                    "and",
                    "account.is_active",
                    "or",
                    "account.balance<0",
                    "and",
                    "account.is_passive"
                ].join(" ")
            }
        });

        assertNode(Expression, {
            input: "1 + 2 ^ 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "+",
                        right: {
                            left: {number: "2"},
                            operator: "^",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1+2^3"
            }
        });

        assertNode(Expression, {
            input: "1 * 2 ^ 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "*",
                        right: {
                            left: {number: "2"},
                            operator: "^",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1*2^3"
            }
        });

        assertNode(Expression, {
            input: "1 ^ 2 / 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "1"},
                            operator: "^",
                            right: {number: "2"}
                        },
                        operator: "/",
                        right: {number: "3"}
                    }
                },
                minify: "1^2/3"
            }
        });

        assertNode(Expression, {
            input: "1 @@@ 2 + 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "@@@",
                        right: {
                            left: {number: "2"},
                            operator: "+",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1@@@2+3"
            }
        });

        assertNode(Expression, {
            input: "1 = 2 @@@ 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "=",
                        right: {
                            left: {number: "2"},
                            operator: "@@@",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1=2@@@3"
            }
        });

        assertNode(Expression, {
            input: "1 = 2 ~ 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "=",
                        right: {
                            left: {number: "2"},
                            operator: "~",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1=2~3"
            }
        });

        assertNode(Expression, {
            input: "1 ilike 2 <#> 3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "1"},
                        operator: "ilike",
                        right: {
                            left: {number: "2"},
                            operator: "<#>",
                            right: {number: "3"}
                        }
                    }
                },
                minify: "1 ilike 2<#>3"
            }
        });

        assertNode(Expression, {
            input: "1 in (1) and 2 in (2)",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operand: {number: "1"},
                            in: [{number: "1"}]
                        },
                        operator: "and",
                        right: {
                            operand: {number: "2"},
                            in: [{number: "2"}]
                        }
                    }
                },
                minify: "1 in(1)and 2 in(2)"
            }
        });

        assertNode(Expression, {
            input: "name ilike '%ooo%' or note not ilike '%ooo%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {column: [
                                {name: "name"}
                            ]},
                            operator: "ilike",
                            right: {string: "%ooo%"}
                        },
                        operator: "or",
                        right: {
                            left: {column: [
                                {name: "note"}
                            ]},
                            operator: "not ilike",
                            right: {string: "%ooo%"}
                        }
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "name ilike '%ooo%' and note not ilike '%ooo%'",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {column: [
                                {name: "name"}
                            ]},
                            operator: "ilike",
                            right: {string: "%ooo%"}
                        },
                        operator: "and",
                        right: {
                            left: {column: [
                                {name: "note"}
                            ]},
                            operator: "not ilike",
                            right: {string: "%ooo%"}
                        }
                    }
                }
            }
        });

        assertNode(Expression, {
            input: "3*-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "*",
                        right: {number: "-2"}
                    }
                },
                pretty: "3 * -2"
            }
        });

        assertNode(Expression, {
            input: "3+-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "+",
                        right: {number: "-2"}
                    }
                },
                pretty: "3 + -2"
            }
        });

        assertNode(Expression, {
            input: "3*+2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "*",
                        right: {
                            preOperator: "+",
                            operand: {number: "2"}
                        }
                    }
                },
                pretty: "3 * + 2",
                minify: "3*+ 2"
            }
        });

        assertNode(Expression, {
            input: "3@-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "@-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 @- 2"
            }
        });

        assertNode(Expression, {
            input: "3@+2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "@+",
                        right: {number: "2"}
                    }
                },
                pretty: "3 @+ 2",
                minify: "3@+2"
            }
        });

        assertNode(Expression, {
            input: "3#-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "#-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 #- 2"
            }
        });

        assertNode(Expression, {
            input: "3~-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "~-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 ~- 2"
            }
        });

        assertNode(Expression, {
            input: "3%-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "%-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 %- 2"
            }
        });

        assertNode(Expression, {
            input: "3^-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "^-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 ^- 2"
            }
        });

        assertNode(Expression, {
            input: "3&-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "&-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 &- 2"
            }
        });

        assertNode(Expression, {
            input: "3!-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "!-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 !- 2"
            }
        });

        assertNode(Expression, {
            input: "3|-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "|-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 |- 2"
            }
        });

        assertNode(Expression, {
            input: "3?-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "?-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 ?- 2"
            }
        });

        assertNode(Expression, {
            input: "3`-2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "`-",
                        right: {number: "2"}
                    }
                },
                pretty: "3 `- 2"
            }
        });

        assertNode(Expression, {
            input: "3`- -2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "3"},
                        operator: "`-",
                        right: {number: "-2"}
                    }
                },
                pretty: "3 `- -2",
                minify: "3`- -2"
            }
        });

    });

});