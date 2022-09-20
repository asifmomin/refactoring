import {Invoice, Performance, Plays} from "./types";

export class StatementPrinter {
    private _plays: Plays;


    constructor(plays: Plays) {
        this._plays = plays;
    }

    public statement(invoice: Invoice) {
        let totalAmount = 0;
        let volumeCredits = 0;
        let result = `Statement for ${invoice.customer}\n`;

        for (let perf of invoice.performances) {
            volumeCredits += this.volumeCreditsFor(perf);
            // print line for this order
            result += ` ${this.playFor(perf).name}: ${this.usd(this.amountFor(perf) / 100)} (${perf.audience} seats)\n`;
            totalAmount += this.amountFor(perf);
        }
        result += `Amount owed is ${this.usd(totalAmount / 100)}\n`;
        result += `You earned ${volumeCredits} credits\n`;
        return result;
    }

    private usd(aNumber: number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber);
    }

    private volumeCreditsFor(perf: Performance) {
        // add volume credits
        let volumeCredits = Math.max(perf.audience - 30, 0);
        if ("comedy" === this.playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
    }

    private playFor(perf: Performance) {
        return this._plays[perf.playID];
    }

    private amountFor(perf: Performance) {
        let thisAmount = 0;
        switch (this.playFor(perf).type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.playFor(perf).type}`);
        }
        return thisAmount;
    }
}
