// bid in a biddingsystem

export class BsBid {

    node: any; // a pointer to a node in a biddingsystem
    bidname: string // the name of the bid in a biddingsystem
    who: number // 0 = we, 1 = they
    direction: number ; // 0>North; 1 > East, 2> South, 3> West

}

// BsBid > Bid
// Bid: level (1-7), kind(C,D,H,S,N)

// BsBiddingSequnce > BiddingSequence


// Follow

