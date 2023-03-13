import { CreateTrigger } from "../CreateTrigger";
import { NameRow, SchemaNameRow } from "../../base";
import { Sql } from "../../Sql";
import { NodeJson } from "abstract-lang";

describe("CreateTrigger.spec.ts", () => {

    it("valid inputs", () => {
        const name: NameRow = {name: "test"};
        const table: NodeJson<SchemaNameRow> = {
            schema: {name: "public"},
            name: {name: "company"}
        };
        const procedure: NodeJson<SchemaNameRow> = {
            schema: {name: "public"},
            name: {name: "test"}
        };

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true
                    }
                },
                minify: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert",
                "on public.company",
                "for each row",
                "execute function public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert",
                "on public.company",
                "for each row",
                "execute FUNCTION public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert",
                "on public.company",
                "for each row",
                "execute PROCedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert",
                "on public.company",
                "for each statement",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true
                    },
                    statement: true
                },
                minify: [
                    "create trigger test",
                    "before insert",
                    "on public.company",
                    "for each statement",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "before delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before update",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        update: true
                    }
                },
                minify: [
                    "create trigger test",
                    "before update",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before insert or delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true,
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "before insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after insert or delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true,
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after delete or insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true,
                        delete: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "after insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "after insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before delete or insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true,
                        delete: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "before insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "before insert or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "before delete or insert or update",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        before: true,
                        insert: true,
                        update: true,
                        delete: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "before insert or update or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "before insert or update or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after insert or update or delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true,
                        update: true,
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after insert or update or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after update or delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        update: true,
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after update or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after update of name, deleted",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        update: [
                            {name: "name"},
                            {name: "deleted"}
                        ]
                    }
                },
                minify: [
                    "create trigger test",
                    "after update of name,deleted",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after update of name, deleted or delete",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        update: [
                            {name: "name"},
                            {name: "deleted"}
                        ],
                        delete: true
                    }
                },
                minify: [
                    "create trigger test",
                    "after update of name,deleted or delete",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after update of deleted or insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join(" "),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true,
                        update: [
                            {name: "deleted"}
                        ]
                    }
                },
                pretty: [
                    "create trigger test",
                    "after insert or update of deleted",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "after insert or update of deleted",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create trigger test",
                "after insert",
                "on public.company",
                "for each row",
                "when (pg_trigger_depth() = 0)",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true
                    },
                    when: {
                        subExpression: {
                            left: {
                                call: {
                                    name: {name: "pg_trigger_depth"}
                                },
                                arguments: []
                            },
                            operator: "=",
                            right: {
                                number: "0"
                            }
                        }
                    }
                },
                minify: [
                    "create trigger test",
                    "after insert",
                    "on public.company",
                    "for each row",
                    "when(pg_trigger_depth()=0)execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create constraint trigger test",
                "after insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    constraint: true,
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create constraint trigger test",
                    "after insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create constraint trigger test",
                "after insert",
                "on public.company",
                "not deferrable",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    constraint: true,
                    deferrable: false,
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create constraint trigger test",
                    "after insert",
                    "on public.company",
                    "not deferrable",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create constraint trigger test",
                "after insert",
                "on public.company",
                "deferrable",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    constraint: true,
                    deferrable: true,
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create constraint trigger test",
                    "after insert",
                    "on public.company",
                    "deferrable",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create constraint trigger test",
                "after insert",
                "on public.company",
                "deferrable initially immediate",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    constraint: true,
                    deferrable: true,
                    initially: "immediate",
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create constraint trigger test",
                    "after insert",
                    "on public.company",
                    "deferrable initially immediate",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create constraint trigger test",
                "after insert",
                "on public.company",
                "deferrable initially deferred",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    constraint: true,
                    deferrable: true,
                    initially: "deferred",
                    events: {
                        insert: true
                    }
                },
                minify: [
                    "create constraint trigger test",
                    "after insert",
                    "on public.company",
                    "deferrable initially deferred",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

        Sql.assertNode(CreateTrigger, {
            input: [
                "create /* multi \n line \r comment */ trigger test",
                "after insert",
                "on public.company",
                "for each row",
                "execute procedure public.test()"
            ].join("\n"),
            shouldBe: {
                json: {
                    name, table, procedure,
                    events: {
                        insert: true
                    }
                },
                pretty: [
                    "create trigger test",
                    "after insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join("\n"),
                minify: [
                    "create trigger test",
                    "after insert",
                    "on public.company",
                    "for each row",
                    "execute procedure public.test()"
                ].join(" ")
            }
        });

    });

});