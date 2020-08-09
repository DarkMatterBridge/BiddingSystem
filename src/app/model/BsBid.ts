import { Bid } from './Bid';

// bid in a biddingsystem > this is the future

export class BsBid {

  node: any; // a pointer to a node in a biddingsystem
  bidname: String // the name of the bid in a biddingsystem
  who: number // 0 = we, 1 = they
  direction: number ; // 0>North; 1 > East, 2> South, 3> West

  context: any;

  BsBid(node: any, bidname: string, who: string, direction :number) {

   }


    matches(bid: Bid) {
      var step = Number(this.bidname);
      if ( step === NaN ) {

      } else { // step
         // step === bid -lastbid
      }

    }

}

// BsBid > Bid
// Bid: level (1-7), kind(C,D,H,S,N)

// BsBiddingSequnce > BiddingSequence


// Follow

