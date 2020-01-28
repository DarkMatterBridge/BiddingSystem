export class Bidding {

    nodes = [];
    bids = [];
    types = [];
    index: number;

    constructor() {
        this.index = 0;
    }

    addBid(nextBid) {
        this.bids.push(nextBid[0]);
        this.nodes.push(nextBid[1]);
        this.types.push(nextBid[3]);
        this.index++;
    }

    getLastBid() {
        return (this.index);
    }

    getBid(i) {
        return [this.bids[i], this.nodes[i], this.nodes[i]["Desc"]];
    }

    getSequence() {
        if (this.index>0)
        console.log(this.bids[0])
        return Array.from({ length: this.index }, (v, k) => k + 1).map(i => [this.bids[i], this.nodes[i]]);
    }

    cutBidding(i) {
        this.bids.splice(i + 1, 100);
        this.nodes.splice(i + 1, 100);
        this.types.splice(i + 1, 100);
    }

}