import { BsBid } from './BsBid';

export class BSBidding {


    bsBids: BsBid[];
    nodes = [];
    bidNames = [];



    types = [];
    direction = [];
    index: number;
    currentDirection = 'N';

    constructor() {
        this.index = 0;
    }

    addBid(nextBid) {

        this.bsBids.push(nextBid);

        this.bidNames.push(nextBid[0]);
        this.nodes.push(nextBid[1]);
        this.types.push(nextBid[3]);
        this.direction.push(this.currentDirection);
        this.toggleDirection();
        this.index++;
    }

    toggleDirection() {
        if (this.currentDirection == 'N')
            this.currentDirection = 'S';
        else
            this.currentDirection = 'N';
    }

    getLastBid() {
        return (this.index);
    }

    getBid(i) {
        return [this.bidNames[i], this.nodes[i], this.nodes[i]["Desc"]];
    }

    getSequence() {
        if (this.index > 0)
            console.log(this.bidNames[0])
        return Array.from({ length: this.index }, (v, k) => k + 1).map(i => [this.bidNames[i], this.nodes[i]]);
    }

    cutBidding(i) {
        this.bsBids.splice(i + 1, 100);
        this.bidNames.splice(i + 1, 100);
        this.nodes.splice(i + 1, 100);
        this.types.splice(i + 1, 100);
    }

    increase(round) {
        var bidsInRound = new Array;
        round.push(bidsInRound);
        return bidsInRound;
    }

    rounds() {
        var round = [];
        var bidsInRound: any;
        var biddingCounter = 0; // 0-3
        var biddingOngoing = false;
        var lastBidWasOppenent = false;

        bidsInRound = this.increase(round);
        for (let index = 0; index < this.bsBids.length; index++) {
            if (this.bsBids[index][3] == 'Opp') {
                if (lastBidWasOppenent && biddingOngoing)
                    bidsInRound.push(['-', { 'Desc': '' }, '', '']);
                bidsInRound.push(this.bsBids[index]);
                biddingCounter = (biddingCounter + 1) % 4;
                if (biddingCounter == 0)
                    bidsInRound = this.increase(round);
                lastBidWasOppenent = true;
            }
            else {
                if (!lastBidWasOppenent && biddingOngoing) {
                    bidsInRound.push(['-', { 'Desc': '' }, '', '']);
                    biddingCounter = (biddingCounter + 1) % 4;
                    if (biddingCounter == 0)
                        bidsInRound = this.increase(round);
                }
                bidsInRound.push(this.bsBids[index]);
                biddingCounter = (biddingCounter + 1) % 4;
                if (biddingCounter == 0)
                    bidsInRound = this.increase(round);
                lastBidWasOppenent = false;
            }
            biddingOngoing = true;
        }
        return round;
    }
}
