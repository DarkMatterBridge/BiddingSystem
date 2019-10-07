import { HttpClient } from '@angular/common/http';

export class BiddingSystem {

    anchors = new Map();
    maxAnchor = 0;

    private _systemHierarchy = {};
    public get systemHierarchy() {
        return this._systemHierarchy;
    }
    public set systemHierarchy(value) {
        this._systemHierarchy = value;
        this.startBidding();
    }
    private _currentNode = {};
    public get currentNode() {
        return this._currentNode;
    }
    public set currentNode(value) {
        this._currentNode = value;
    }
    private _currentBid: string;
    public get currentBid(): string {
        return this._currentBid;
    }
    public set currentBid(value: string) {
        this._currentBid = value;
    }

    private currentPossibleBids: [];

    bridgeSystemUrl = 'assets/bridgePrecision.json';

    constructor(private http: HttpClient) {
        this.loadSystem();
    }

    getLocalBridgeSystem() {
        return this.http.get(this.bridgeSystemUrl);
    }

    loadSystem() {
        var getter = this.getLocalBridgeSystem();
        getter.subscribe(
            (data: any) => {
                this.systemHierarchy = data;
                this.startBidding();
            }
        );
        return getter;
    }


    getCurrentDescription() {
        return this.getDescription(this.currentNode);
    }

    getDescription(node: any) {
        return node["Desc"];
    }

    getCurrentPossibleBids() {
        return this.getPossibleBids(this.currentNode);
        //        return Object.getOwnPropertyNames(this.activatedAfterFollow).map(bid => [bid,this.activatedAfterFollow[bid]]);
    }

    getPossibleBids(node: any) {
        if (!this.followExist(node))
            this.addEmptyFollow(node); // add default follow
        var bids = Object.getOwnPropertyNames(node["Follow"]).map(bid => [bid, node["Follow"][bid]])
        if (node["Opponent"] )
        bids = bids.concat(Object.getOwnPropertyNames(node["Opponent"]).map(bid => [bid, node["Opponent"][bid]]));
        return bids;
    }

    followExist(node: any) {
        return node["Follow"] != undefined;
    }

    addEmptyFollow(node: any) {
        node["Follow"] = {};
    }

    getCurrentBid() {
        return [this.currentBid, this.currentNode];
    }

    getBidByIndex(i) {
        return this.getCurrentPossibleBids()[i];
    }

    getBidByName(bid: string) {
        return this.getCurrentPossibleBids().filter(bidob => bidob[0] === bid)[0];
    }

    selectBidByIndex(i) {
        var bidob = this.getBidByIndex(i);
        this.selectBid(bidob);
    }

    selectBidByName(bid: string) {
        var bidob = this.getBidByName(bid);
        this.selectBid(bidob);
    }

    selectBid(bidob) {
        this.currentBid = bidob[0];
        this.currentNode = bidob[1];
        var an = this.getAttachedNode(this.currentNode);
        this.currentNode = this.getAttachedNode(this.currentNode);  // todo > repitition + bidding
        this.currentNode = this.getAttachedNode(this.currentNode);
        //        this.retireafterfollow = this.activeafterfollow; 
        //        this.activAfterfollow = this.preparedAfterfollow;
        //        this.preparedAfterFollow = this.currentNode["Afterfollow"];
    }

    followIsAttachedNode(node) {
        return node["Follow"] != null && typeof node["Follow"] === 'string'
    }

    followHasRealChild(node) {
//        alert(JSON.stringify(node["Follow"]))
        return node["Follow"] != null && typeof node["Follow"] != 'string' && node["Follow"] != {}
    }

    hasFollow(node) {
//        alert(JSON.stringify(node["Follow"]))
        return node["Follow"] != null && node["Follow"] != {}
    }

    getAttachedNode(node) {
        if (this.followIsAttachedNode(node)) {
            return this.anchors.get(node["Follow"])[0];
        } else {
            return node;
        }
    }

    getAttachedRootNode(node) {
        if (this.followIsAttachedNode(node)) {
            return this.systemHierarchy[node["Follow"]];
        } else {
            return node;
        }
    }

    /// Anchors
    attachAnchorToCurrentNode(anchor) {
        this.attachNode(this.currentNode, anchor);
        console.log("Added Anchor " + anchor + " to " + this.currentBid);
        this.currentNode = this.getAttachedNode(this.currentNode);
        this.currentNode = this.getAttachedNode(this.currentNode);
    }

    attachNode(node: any, anchor: string) {
        alert("Anchor : " + anchor + "Follow : " + node["Follow"]);
        if (anchor != node["Follow"]) {
            node["Follow"] = anchor;
        } else
            alert("Self Attachment not allowed");
    }

    addAnchor(i) {
        var obid = this.getBidByIndex(i);
        this.addAnchorToNode(obid[1]);
    }

    addAnchorToNode(node) {
        this.maxAnchor++;
        node["Anchor"] = this.maxAnchor.toString();
        this.findAllAnchors();
    }

    removeAnchor(i): boolean {
        var obid = this.getBidByIndex(i);
        return this.removeAnchorFromNode(obid[1]);
    }

    removeAnchorFromNode(node): boolean {
        delete node["Anchor"]
        return true;
    }

    addBidToNode(node: any, bid: string, description: string) {
        if (this.followExist(node))
            node["Follow"][bid] = { 'Desc': description };
    }

    addBidToCurrentNode(bid: string, description: string) {
        this.addBidToNode(this.currentNode, bid, description);
        this.findAllAnchors();
    }

    startBidding() {
      //  a["1Z"] =  JSON.parse(JSON.stringify(b))
        this.currentNode = this.systemHierarchy["opening"];
        this.currentBid = "";
        this.findAllAnchors();
        return this.getCurrentPossibleBids();
    }

    startRootBidding() {
        this.currentNode = {"Follow":this.systemHierarchy};
        this.currentBid = "";
        this.findAllAnchors();
        return this.getCurrentPossibleBids();
    }

    getRootNodes() {
        let rootnodes = Object.getOwnPropertyNames(this.systemHierarchy);
        rootnodes.forEach(rootnodeName => {
            console.log(rootnodeName);
            console.log(this.systemHierarchy[rootnodeName]["Follow"]);
            this.anchors.set(rootnodeName, [this.systemHierarchy[rootnodeName], this.systemHierarchy[rootnodeName]["Desc"]]);
        });

        //        for (var i in this.systemHierarchy) {
        //            this.anchors.push([this.systemHierarchy[i], i, this.systemHierarchy[i]["Desc"]]);
        //           this.anchors[i]=[this.systemHierarchy[i],this.systemHierarchy[i]["Desc"]];
        //           console.log(this.anchors[i][1]);
        //       }
    }

    findAllAnchors() {
        this.maxAnchor = 0;
        this.anchors = new Map();
        this.traverse(this.systemHierarchy, "Anchor", "");
        this.getRootNodes();
        return this.anchors;
    }

    findAllFollow() {

    }

    traverse(o, name, bidsequence) {
        for (var i in o) {
            if (o[i] !== null && typeof (o[i]) == "object") {
                this.traverse(o[i], name, bidsequence + i.replace("Follow", "-"));
            } else
                if (i == name) {
                    if (this.hasFollow(o)) {
                        this.anchors.set(o[i], [o, bidsequence + " : " + o["Desc"]]);
                        if (+o[i] > this.maxAnchor)
                            this.maxAnchor = +o[i];
                    }
                }
        }
    }


}