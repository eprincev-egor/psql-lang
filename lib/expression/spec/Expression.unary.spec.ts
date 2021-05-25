import { assertNode } from "abstract-lang";
import { Expression } from "../Expression";

describe("Expression.unary.spec.ts", () => {

    it("valid inputs", () => {

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
            input: "true IS  \n truE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: true},
                        postOperator: "is true"
                    }
                },
                pretty: "true is true",
                minify: "true is true"
            }
        });

        assertNode(Expression, {
            input: "true IS nOt  \n truE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: true},
                        postOperator: "is not true"
                    }
                },
                pretty: "true is not true",
                minify: "true is not true"
            }
        });

        assertNode(Expression, {
            input: "true NOTtruE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: true},
                        postOperator: "is not true"
                    }
                },
                pretty: "true is not true",
                minify: "true is not true"
            }
        });

        assertNode(Expression, {
            input: "false IS  \n falsE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: false},
                        postOperator: "is false"
                    }
                },
                pretty: "false is false",
                minify: "false is false"
            }
        });

        assertNode(Expression, {
            input: "false IS Not  \n falsE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: false},
                        postOperator: "is not false"
                    }
                },
                pretty: "false is not false",
                minify: "false is not false"
            }
        });

        assertNode(Expression, {
            input: "false notFalsE",
            shouldBe: {
                json: {
                    operand: {
                        operand: {boolean: false},
                        postOperator: "is not false"
                    }
                },
                pretty: "false is not false",
                minify: "false is not false"
            }
        });

    });

});