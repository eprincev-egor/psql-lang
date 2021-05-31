import { Sql } from "../../Sql";
import { WindowDefinitionFrame } from "../WindowDefinitionFrame";

describe("WindowDefinitionFrame", () => {

    it("valid inputs", () => {

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows unbounded preceding",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "preceding",
                        value: "unbounded"
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "ROWS UNBOUNDED FOLLOWING",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "following",
                        value: "unbounded"
                    }
                },
                pretty: "rows unbounded following",
                minify: "rows unbounded following"
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "range\nunbounded\tpreceding",
            shouldBe: {
                json: {
                    type: "range",
                    start: {
                        type: "preceding",
                        value: "unbounded"
                    }
                },
                minify: "range unbounded preceding",
                pretty: "range unbounded preceding"
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows unbounded following",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "following",
                        value: "unbounded"
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "range unbounded following",
            shouldBe: {
                json: {
                    type: "range",
                    start: {
                        type: "following",
                        value: "unbounded"
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows 1 preceding",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "preceding",
                        value: {number: "1"}
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows 999 following",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "following",
                        value: {number: "999"}
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows between 1 preceding and 2 preceding",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "preceding",
                        value: {number: "1"}
                    },
                    end: {
                        type: "preceding",
                        value: {number: "2"}
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows between unbounded following and current row",
            shouldBe: {
                json: {
                    type: "rows",
                    start: {
                        type: "following",
                        value: "unbounded"
                    },
                    end: {
                        type: "currentRow"
                    }
                }
            }
        });

        Sql.assertNode(WindowDefinitionFrame, {
            input: "range between unbounded preceding and 88 following",
            shouldBe: {
                json: {
                    type: "range",
                    start: {
                        type: "preceding",
                        value: "unbounded"
                    },
                    end: {
                        type: "following",
                        value: {number: "88"}
                    }
                }
            }
        });

    });

    it("invalid inputs", () => {

        Sql.assertNode(WindowDefinitionFrame, {
            input: "rows unbounded wrong",
            throws: /expected preceding or following/,
            target: "wrong"
        });

    });

});