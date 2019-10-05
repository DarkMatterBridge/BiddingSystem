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

    private _currentPossibleBids: any;
    public get currentPossibleBids(): any {
        return this._currentPossibleBids;
    }
    public set currentPossibleBids(value: any) {
        this._currentPossibleBids = value;
    }

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

    getCurrentPossibleBids_() {
        return this.getPossibleBids(this.currentNode);
        //        return Object.getOwnPropertyNames(this.activatedAfterFollow).map(bid => [bid,this.activatedAfterFollow[bid]]);
    }

    getPossibleBids(node: any) {
        if (!this.followExist(node))
            this.addEmptyFollow(node); // add default follow
        return Object.getOwnPropertyNames(node["Follow"]).map(bid => [bid, node["Follow"][bid]]);
    }

    determineCurrentPossibleBids() {
        this.currentPossibleBids = this.getPossibleBids(this.currentNode);
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
        return this.getCurrentPossibleBids_()[i];
    }

    getBidByName(bid: string) {
        return this.getCurrentPossibleBids_().filter(bidob => bidob[0] === bid)[0];
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
        this.currentNode = this.getAttachedNode(this.currentNode);
        this.determineCurrentPossibleBids();
        //        this.retireafterfollow = this.activeafterfollow; 
        //        this.activAfterfollow = this.preparedAfterfollow;
        //        this.preparedAfterFollow = this.currentNode["Afterfollow"];
    }

    followIsAttachedNode(node) {
        return node["Follow"] != null && typeof node["Follow"] === 'string'
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

    attachAnchorToCurrentNode(anchor) {
        this.attachRootNode(this.currentNode, anchor);
        this.currentNode = this.getAttachedNode(this.currentNode);
    }

    attachRootNode(node: any, anchor: string) {
        node["Follow"] = anchor;
        console.log("Added Anchor "+anchor+" to "+this.currentBid);
    }

    addBidToNode(node: any, bid: string, description: string) {
        if (this.followExist(node))
            node["Follow"][bid] = { 'Desc': description };
    }

    addBidToCurrentNode(bid: string, description: string) {
        this.addBidToNode(this.currentNode, bid, description);
    }

    startBidding() {
        this.currentNode = this.systemHierarchy["opening"];
        this.currentBid = "";
        this.findAllAnchors();
        return this.getCurrentPossibleBids_(); 
    }

    getRootNodes() {
        let rootnodes =  Object.getOwnPropertyNames(this.systemHierarchy);
        rootnodes.forEach(rootnodeName => {
            console.log(rootnodeName);
            console.log(this.systemHierarchy[rootnodeName]["Follow"]);
            this.anchors.set(rootnodeName, [this.systemHierarchy[rootnodeName],this.systemHierarchy[rootnodeName]["Desc"] ]);
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
        this.traverse(this.systemHierarchy, "");
        this.getRootNodes();
        return this.anchors;
    }

    traverse(o, bidsequence) {
        for (var i in o) {
            if (o[i] !== null && typeof (o[i]) == "object") {
                this.traverse(o[i], bidsequence + i.replace("Follow", "-"));
            } else
                if (i == "Anchor") {
                    this.anchors.set(o[i],[o, bidsequence +" : " + o["Desc"]]);
                    if ( +o[i]> this.maxAnchor)
                      this.maxAnchor = +o[i];
                    console.log("Anchor found: "+o[i]);
                }
        }
    }


}