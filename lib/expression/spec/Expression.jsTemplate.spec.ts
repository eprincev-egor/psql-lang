import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.between.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "${1}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "1"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "coalesce(${variable}, 2)",
            shouldBe: {
                json: {
                    operand: {
                        call: {
                            name: {name: "coalesce"}
                        },
                        arguments: [
                            {jsTemplateValue: "variable"},
                            {number: "2"}
                        ]
                    }
                },
                minify: "coalesce(${variable},2)"
            }
        });

        Sql.assertNode(Expression, {
            input: "${'}'}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "'}'"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${\"}\"}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "\"}\""
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${`}`}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "`}`"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${//}\n}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "//}\n"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${/*}*/}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "/*}*/"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${{}}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "{}"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${\"\\\"\"}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "\"\\\"\""
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${'\\''}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "'\\''"
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "${`\\``}",
            shouldBe: {
                json: {
                    operand: {
                        jsTemplateValue: "`\\``"
                    }
                }
            }
        });

    });

});