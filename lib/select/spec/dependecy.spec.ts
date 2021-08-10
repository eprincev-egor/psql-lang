import assert from "assert";
import { ColumnReference } from "../../expression/ColumnReference";
import { Sql } from "../../Sql";
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

    it("from parent query WITH lateral", () => {
        testDependencies({
            input: `
                select from company
                join lateral (
                    select from country
                    where
                        country.id = company.id_country
                ) as country on true
            `,
            check([countryId, companyCountryId], [company, join, country]) {
                assert.ok(
                    countryId.findDeclaration() === country,
                    "country.id"
                );
                assert.ok(
                    companyCountryId.findDeclaration() === company,
                    "company.id_country"
                );
            }
        });
    });

    it("from parent query WITHOUT lateral", () => {
        testDependencies({
            input: `
                select from company
                join (
                    select from country
                    where
                        country.id = company.id_country
                ) as country on true
            `,
            check([, companyCountryId]) {
                assert.ok(
                    companyCountryId.findDeclaration() === undefined,
                    "company.id_country"
                );
            }
        });
    });

    it("select * from x, y", () => {
        testDependencies({
            input: `
                select * from x, y
            `,
            check([all]) {
                assert.ok(
                    all.findDeclaration() === undefined
                );
            }
        });
    });

    it("row_to_json(company) from public.company", () => {
        testDependencies({
            input: `
                select row_to_json(company)
                from public.company
            `,
            check([companyRow], [company]) {
                assert.ok(
                    companyRow.findDeclaration() === company
                );
            }
        });
    });

    it("row_to_json(unknown) from public.company", () => {
        testDependencies({
            input: `
                select row_to_json(unknown)
                from public.company
            `,
            check([unknownRow]) {
                assert.ok(
                    unknownRow.findDeclaration() === undefined
                );
            }
        });
    });

    it("operation.table2.name from operation.operation, operation.table2", () => {
        testDependencies({
            input: `
                select
                    operation.table2.name 
                from operation.operation, operation.table2
            `,
            check([column], [, table2]) {
                assert.ok(
                    column.findDeclaration() === table2
                );
            }
        });
    });

    it("company.company.name from x.company, y.company", () => {
        testDependencies({
            input: `
                select
                    company.company.name
                from x.company, y.company
            `,
            check([column]) {
                assert.ok(
                    column.findDeclaration() === undefined
                );
            }
        });
    });

    it("when Object.prototype was changed", () => {
        // lib sql bricks do it:
        (Object.prototype as any).as = function() {
            return;
        };

        testDependencies({
            input: `
                select company.name
                from "company"
            `,
            check([xName], [x]) {
                assert.ok(
                    xName.findDeclaration() === x
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
        const select = Sql.code( test.input.trim() ).parse(Select);

        const columnReferences = select.filterChildrenByInstance(ColumnReference);
        const fromItems = select.filterChildrenByInstance(AbstractFromItem);
        test.check(columnReferences, fromItems as FromItemType[]);
    }
});