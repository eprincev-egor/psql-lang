import { Sql } from "../../Sql";
import { Expression } from "../Expression";

describe("Expression.trim.spec.ts", () => {

    it("valid inputs", () => {

        Sql.assertNode(Expression, {
            input: "trim('hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: "hello"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "trim( BOTH 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: "hello"}
                    }
                },
                pretty: "trim('hello')",
                minify: "trim('hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim( LEADING 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "leading",
                        from: {string: "hello"}
                    }
                },
                pretty: "trim(leading 'hello')",
                minify: "trim(leading 'hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim( TRAILING 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "trailing",
                        from: {string: "hello"}
                    }
                },
                pretty: "trim(trailing 'hello')",
                minify: "trim(trailing 'hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim( FROM 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: "hello"}
                    }
                },
                pretty: "trim('hello')",
                minify: "trim('hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim( 'ho' FROM 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: "hello"},
                        characters: {string: "ho"}
                    }
                },
                pretty: "trim('ho' from 'hello')",
                minify: "trim('ho' from 'hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim(leading 'ho' from 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "leading",
                        from: {string: "hello"},
                        characters: {string: "ho"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "trim(trailing 'ho' from 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "trailing",
                        from: {string: "hello"},
                        characters: {string: "ho"}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "trim(both 'ho' from 'hello')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: "hello"},
                        characters: {string: "ho"}
                    }
                },
                pretty: "trim('ho' from 'hello')",
                minify: "trim('ho' from 'hello')"
            }
        });

        Sql.assertNode(Expression, {
            input: "trim(settings.trim_characters from company.name)",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {column: [
                            {name: "company"},
                            {name: "name"}
                        ]},
                        characters: {column: [
                            {name: "settings"},
                            {name: "trim_characters"}
                        ]}
                    }
                }
            }
        });

        Sql.assertNode(Expression, {
            input: "trim(',a,b,c,', ',')",
            shouldBe: {
                json: {
                    operand: {
                        trim: "both",
                        from: {string: ",a,b,c,"},
                        characters: {string: ","}
                    }
                },
                pretty: "trim(',' from ',a,b,c,')",
                minify: "trim(',' from ',a,b,c,')"
            }
        });

    });

});