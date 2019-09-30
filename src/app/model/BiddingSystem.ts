import { getBindingRoot } from '@angular/core/src/render3/state';

export class BiddingSystem {

    systemHierarchy = {};

    currentNode = {};
    currentBid: string;

    loadSystem() {
    }

    getCurrentDescription() {
      return this.getDescription(this.currentNode);
    }

    getDescription(node: any) {
        return node["Desc"];
      }
  
    getCurrentPossibleBids() {
        return this.getPossibleBids(this.currentNode);
    }

    getPossibleBids(node: any) {
        var followBranch = this.getFollowBranch(node);
        if (!followBranch)
           return null;        
        return Object.getOwnPropertyNames(followBranch["Follow"]).map(bid => [bid,followBranch[bid]]);
    }

    getCurrentBid() {
        return this.currentBid;
    }

    getBidByIndex(i: number) {
        this.getCurrentPossibleBids()[i];
    }

    getBidByName(bid: string) {
        this.getCurrentPossibleBids().filter(bidob => bidob[0]===bid)[0];
    }

    selectBidByIndex(i: number) {
       var bidob = this.getBidByIndex(i);
       this.currentBid = bidob[0];
       this.currentNode = bidob[1];
    }

    selectBidByName(bid: string) {
        var bidob = this.getBidByName(bid);
        this.currentBid = bidob[0];
        this.currentNode = bidob[1];
     }

     followExist(node: any) {
         return node["Follow"] != undefined;
     }

     followIsAttachedBidding(node: any) {
        return node["Follow"] != undefined && node["Follow"] instanceof String
    }

    getFollowBranch(node: any) {
        if (!this.followExist(node))
           return null;
        if (this.followIsAttachedBidding(node)) {
            return this.systemHierarchy[node["Follow"]];
        } else {
            return node["Follow"];
        }
    }



     startBidding() {
         this.currentNode = this.systemHierarchy["opening"];
         this.currentBid = "";
     }



     getRootNodes() {

     }

}