import { statement} from '../../src/statement'
import invoices from '../../src/invoices.json'
import plays from '../../src/plays.json'
import fs from "fs";
import path from "path";
import expect from "expect.js";

describe('StatementTest', () => {

    before(() => {
    });

    it('shouldOutputStatement', () => {
        VerifyOutput(statement(invoices[0], plays), "outputStatement");
    });


    function readFile(fileName: string): string[] {
        return fs.readFileSync(fileName, 'utf-8')
            .split('\n')
            .filter(Boolean);
    }

    const VerifyOutput = (actualValue: string, fileName: string) => {
        var filePath = path.join(__dirname, fileName);
        var expectedLines = readFile(filePath);
        var actualLines = actualValue.split('\n').filter(Boolean);
        expect(actualLines.length).to.eql(expectedLines.length);
        expectedLines.forEach((value, index) => {
            expect(actualLines[index]).to.eql(value);
        })
    };
});
