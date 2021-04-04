import { assertNode } from "abstract-lang";
import { Name } from "../Name";

describe("Name", () => {

    it("valid inputs", () => {

        assertNode(Name, {
            input: "name",
            shouldBe: {
                json: {name: "name"}
            }
        });

        assertNode(Name, {
            input: "hello",
            shouldBe: {
                json: {name: "hello"}
            }
        });

        assertNode(Name, {
            input: "HELLO",
            shouldBe: {
                json: {name: "hello"},
                pretty: "hello",
                minify: "hello"
            }
        });

        assertNode(Name, {
            input: "__",
            shouldBe: {
                json: {name: "__"}
            }
        });

        assertNode(Name, {
            input: "a1",
            shouldBe: {
                json: {name: "a1"}
            }
        });

        assertNode(Name, {
            input: "XYZ1ABC ",
            shouldBe: {
                json: {name: "xyz1abc"},
                pretty: "xyz1abc",
                minify: "xyz1abc"
            }
        });

    });

    it("invalid inputs", () => {

        assertNode(Name, {
            input: "0a",
            throws: /name should starts with alphabet char, invalid name: 0a/
        });

    });

});