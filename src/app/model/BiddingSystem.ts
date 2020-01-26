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

    private _currentFollowNode = {};
    public get currentFollowNode() {
        return this._currentFollowNode;
    }
    public set currentFollowNode(value) {
        this._currentFollowNode = value;
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

    // ------------------- System-Initializer --------------------------------------------------------------

    getLocalBridgeSystem() {
        return this.http.get(this.bridgeSystemUrl);
    }

    newSystem() {
        this.systemHierarchy = { "opening": { "Follow": { "1C": { "Desc": "...." } } } };
        this.startBidding();
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

    // ------------------- Biding starts --------------------------------------------------------------

    startBidding() {
        this.currentFollowNode = this.systemHierarchy;
        //        this.currentBid2 = "opening";
        this.currentNode = this.systemHierarchy["opening"];
        this.currentBid = "";
        this.findAllAnchors();
        return this.getCurrentPossibleBids();
    }

    startRootBidding() {
        this.currentFollowNode = { "root": { "Follow": this.systemHierarchy } };
        //        this.currentBid2 = "root";
        this.currentNode = { "Follow": this.systemHierarchy };
        this.currentBid = "";
        this.findAllAnchors();
        return this.getCurrentPossibleBids();
    }


    // ------------------- get Currents Bids --------------------------------------------------------------


    getCurrentDescription() {
        return this.getDescription(this.currentNode);
    }

    getDescription(node: any) {
        return node["Desc"];
    }

    getCurrentBid() {
        return [this.currentBid, this.currentNode];
    }

    // ------------------- Getting Possible Bids  --------------------------------------------------------------


    getCurrentPossibleBids() {
        return this.getPossibleBids(this.currentNode);
        //        return Object.getOwnPropertyNames(this.activatedAfterFollow).map(bid => [bid,this.activatedAfterFollow[bid]]);
    }

    getPossibleBids(node: any) {
        var bids = this.getDirectPossibleBids(node, "Follow", "direct");
        if (node["Link"]) {
            bids = bids.concat(this.getDirectPossibleBids(this.getLinkedNode(node), "Follow",
                "linked: " + this.getLinkedNode(node)["Desc"]));
        }

        if (node["Opponent"])
            bids = bids.concat(this.getDirectPossibleBids(node, "Opponent", "opponent"));
        return bids;
    }

    getDirectPossibleBids(node: any, name, typ) {
        if (!this.followExist(node))
            this.addEmptyFollow(node);
        return Object.getOwnPropertyNames(node[name]).map(bid => [bid, node[name][bid], node[name], typ])
    }

    followExist(node: any) {
        return node["Follow"] != undefined;
    }

    getBidByIndex(i) {
        return this.getCurrentPossibleBids()[i];
    }

    getBidByName(bid: string) {
        return this.getCurrentPossibleBids().filter(bidob => bidob[0] === bid)[0];
    }

    // ------------------- Links  --------------------------------------------------------------

    linkExist(node: any) {
        return node["Link"] != undefined;
    }

    hasLink(node) {
        return node["Link"] != null
    }

    getLinkedNode(node) {
        return this.anchors.get(Object.getOwnPropertyNames(node["Link"])[0])[0];
    }

    // ------------------- Bid Selection --------------------------------------------------------------

    selectBidByIndex(i) {
        var bidob = this.getBidByIndex(i);
        this.selectBid(bidob);
    }

    selectBidByName(bid: string) {
        var bidob = this.getBidByName(bid);
        this.selectBid(bidob);
    }

    selectBid(bidob) {
        this.currentBid = bidob[0];   // Bidname
        this.currentNode = bidob[1];  // node after bidname
        this.currentFollowNode = bidob[2];  // node after follow before bidname

        //       this.currentNode = this.getAttachedNode(this.currentNode);  // todo > repitition + bidding
        //       this.currentNode = this.getAttachedNode(this.currentNode);
        //        this.retireafterfollow = this.activeafterfollow; 
        //        this.activAfterfollow = this.preparedAfterfollow;
        //        this.preparedAfterFollow = this.currentNode["Afterfollow"];
    }


    // followHasRealChild(node) {
    //     //        alert(JSON.stringify(node["Follow"]))
    //     return node["Follow"] != null && typeof node["Follow"] != 'string' && node["Follow"] != {}
    // }


    // getAttachedNode(node) {
    //     if (this.followIsAttachedNode(node)) {
    //         return this.anchors.get(node["Follow"])[0];
    //     } else {
    //         return node;
    //     }
    // }

    // followIsAttachedNode(node) {
    //     return node["Follow"] != null && typeof node["Follow"] === 'string'
    // }

    // getAttachedRootNode(node) {
    //     if (this.followIsAttachedNode(node)) {
    //         return this.systemHierarchy[node["Follow"]];
    //     } else {
    //         return node;
    //     }
    // }

    // ------------------- Add anchor links to Nodes --------------------------------------------------------------

    attachAnchorToCurrentNode(anchor) {
        this.attachAnchorToNode(this.currentNode, anchor);
        console.log("Added Anchor " + anchor + " to " + this.currentBid);
    }

    attachAnchorToNode(node: any, anchor: string) {
        node["Link"] = {}
        node["Link"][anchor] = 'normal';
    }

    detachAnchorFromNode(node) {
        delete node["Link"]
        //        node["Link"] = {}
    }

    materialAnchorAtNode(bid) {

        var bidname = bid[0];
        var bidnode = bid[1];
        var follownode = bid[2];
        console.log(bidnode);
        var json = JSON.stringify(this.getLinkedNode(bidnode));
       console.log(json);
        delete bidnode["Link"]
        follownode[bidname] = JSON.parse(json);
        delete follownode[bidname]["Anchor"];
        // remove link todo
    }
    // ------------------- Create and Remove Anchors at Nodes --------------------------------------------------------------

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

    // ------------------- Add and remove Bids to Nodes --------------------------------------------------------------

    addEmptyFollow(node: any) {
        node["Follow"] = {};
    }

    addBidToNode(node: any, bid: string, description: string) {
        if (this.followExist(node))
            node["Follow"][bid] = { 'Desc': description };
    }

    addBidToCurrentNode(bid: string, description: string) {
        this.addBidToNode(this.currentNode, bid, description);
        this.findAllAnchors();
    }

    removeBidFromCurrentNode(bidname) {
        var nd = this.currentNode["Follow"]
        delete nd[bidname]
    }

    // ------------------- Finding all Anchors --------------------------------------------------------------

    findAllAnchors() {
        this.maxAnchor = 0;
        this.anchors = new Map();
        this.findInlineAnchors(this.systemHierarchy, "");
        this.getRootAnchors();
        return this.anchors;
    }

    getRootAnchors() {
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

    findInlineAnchors(node, bidsequence) {
        for (var name in node) {
            if (node[name] !== null && typeof (node[name]) == "object") {
                this.findInlineAnchors(node[name], bidsequence + name.replace("Follow", "-"));
            } else
                if (name == "Anchor") {
                    if (this.hasFollow(node)) {
                        this.anchors.set(node[name], [node, bidsequence + " : " + node["Desc"]]);
                        if (+node[name] > this.maxAnchor)
                            this.maxAnchor = +node[name];
                    }
                }
        }
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

    hasFollow(node) {
        //        alert(JSON.stringify(node["Follow"]))
        return node["Follow"] != null && node["Follow"] != {}
    }


    findAllFollow() {

    }





}