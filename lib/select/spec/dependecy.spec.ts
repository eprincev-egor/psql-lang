import { SourceCode } from "abstract-lang";
import assert from "assert";
import { ColumnReference } from "../../expression/ColumnReference";
import { AbstractFromItem } from "../AbstractFromItem";
import { FromItemType } from "../FromItem";
import { Select } from "../Select";

describe("ColumnReference", () => {

    it("compare table name", () => {
        testDependencies({
            input: `
                select
                    company.name,
                    user.name
                from company, user
            `,
            check(columnReferences, fromItems) {

                const companyName = columnReferences[0];
                assert.strictEqual( companyName.toString(), "company.name" );

                const userName = columnReferences[1];
                assert.strictEqual( userName.toString(), "user.name" );

                const company = fromItems[0];
                assert.strictEqual( company.toString(), "company" );

                const user = fromItems[1];
                assert.strictEqual( user.toString(), "user" );

                assert.ok(
                    companyName.findDeclaration() === company,
                    "company.name"
                );
                assert.ok(
                    userName.findDeclaration() === user,
                    "user.name"
                );
            }
        });
    });

    it("compare alias name", () => {
        testDependencies({
            input: `
                select
                    company.name,
                    user.name
                from
                    (select) as company,
                    (select) as user
            `,
            check([companyName, userName], [company, user]) {
                assert.ok(
                    companyName.findDeclaration() === company,
                    "company.name"
                );
                assert.ok(
                    userName.findDeclaration() === user,
                    "user.name"
                );
            }
        });
    });

    it("select \"company\".name from company", () => {
        testDependencies({
            input: `
                select "company".name
                from company
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("select company.name from \"company\"", () => {
        testDependencies({
            input: `
                select company.name
                from "company"
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("select \"company\".name from \"company\"", () => {
        testDependencies({
            input: `
                select "company".name
                from "company"
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("select \"company\".name from public.list_company as \"company\"", () => {
        testDependencies({
            input: `
                select "company".name
                from public.list_company as "company"
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("public.company.name from public.company", () => {
        testDependencies({
            input: `
                select public.company.name
                from public.company
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("company.name from public.company", () => {
        testDependencies({
            input: `
                select company.name
                from public.company
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("public.company.name from company", () => {
        testDependencies({
            input: `
                select public.company.name
                from company
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    it("same table inside two schemas", () => {
        testDependencies({
            input: `
                select
                    operation.unit.id,
                    declaration.unit.id
                from operation.unit, declaration.unit
            `,
            check([operationUnitId, decUnitId], [operationUnit, decUnit]) {
                assert.ok(
                    operationUnitId.findDeclaration() === operationUnit
                );
                assert.ok(
                    decUnitId.findDeclaration() === decUnit
                );
            }
        });
    });

    it("test_alias.name from company as test_alias", () => {
        testDependencies({
            input: `
                select test_alias.name
                from public.company as test_alias
            `,
            check([companyName], [company]) {
                assert.ok(
                    companyName.findDeclaration() === company
                );
            }
        });
    });

    interface TestDeps {
        input: string;
        check(
            columns: ColumnReference[],
            fromItems: FromItemType[]
        ): void;
    }
    function testDependencies(test: TestDeps) {
        const code = new SourceCode({
            text: test.input.trim()
        });
        const select = code.cursor.parse(Select);

        const columnReferences = select.filterChildrenByInstance(ColumnReference);
        const fromItems = select.filterChildrenByInstance(AbstractFromItem);
        test.check(columnReferences, fromItems as FromItemType[]);
    }
});