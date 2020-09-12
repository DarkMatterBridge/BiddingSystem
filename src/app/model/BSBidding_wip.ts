import { Bidding } from './Bidding';
import { BiddingSystem } from './BiddingSystem';
import { Bid } from './Bid';

export class BSBidding_wip {   //  völlig unfertig

    bidding: Bidding;
    biddingSystem: BiddingSystem;
    realBidding: any; // todo

    loopt() {

        // loop durch realBidding
        // match jedes Bid auf bidding und biddingsystem
    }

    matchNewBid(bid: Bid) {

        var currentPossibleBids = this.biddingSystem.getCurrentPossibleBids();
        currentPossibleBids.forEach(element => {
            // direct match z.B. 1N - 2C - 2D
            // stepwise match 3 (step)  entspricht 1S-2C-2S
            // major or minor match: 1N-3M
            // bidsuit match
            // match of M/m  repition: 1M-3M
            // .....
            if (element[0] === bid.name()) {

            }

        });
    }

    generateRealBids() {
        var currentPossibleBids = this.biddingSystem.getCurrentPossibleBids();
        var realBids = {};

        // sort bids by concrete, placeholder, steps
        currentPossibleBids.forEach(bsBid => {
            if (this.isConcrete(bsBid)) {
                realBids[bsBid[0]] = [bsBid[1], new Bid(bsBid[0])];
            }
            if (this.hasPlaceHolder(bsBid)) { // M or m
            }
            if (this.isStep(bsBid)) {
            }
        });

    }

    isConcrete(bid) {
        return true;
    }

    hasPlaceHolder(bid) {
        return true;
    }
    isStep(bid) {
        return true;
    }

    //   BSBidding
    //   RealBidding

    //   Aufgabe: Transformiere RealBidding zu BSBidding
    // Dafür brauchen wir RealBdding BSBidding



}
