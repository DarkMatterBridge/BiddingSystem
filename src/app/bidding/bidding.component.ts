import { Component, OnInit } from '@angular/core';
import { BiddingSystem } from '../model/BiddingSystem';
import { HttpClient } from '@angular/common/http';
import { Bidding } from '../model/Bidding';

@Component({
  selector: 'app-bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.css']
})

export class BiddingComponent implements OnInit {

  biddingSystem: BiddingSystem;
  bidding: Bidding;
  anchors: any;
  keys: any[];
  editMode = false;
  showDescription = true;
  http: HttpClient;
  possibleBids: any[];

  bid: string;
  desc: string;

  red = "red";
  bsName = "biSy.json";

  constructor(http: HttpClient) { this.http = http }

  ngOnInit() {
    this.biddingSystem = new BiddingSystem(this.http);
    this.biddingSystem.loadSystem().subscribe(
      (data: any) => {
        this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
        this.bidding = this.biddingSystem.bidding;
      }
    );
    //    this.bidding = new Bidding();
  }

  select(i) {
    this.biddingSystem.selectBid(this.getBid(i));
//    this.bidding = this.biddingSystem.bidding;
    //    this.bidding.addBid(this.biddingSystem.getCurrentBid());
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
    if (this.possibleBids.length == 0) {
      this.getAnchors();
    }
  }

  getBid(i) {
    return this.biddingSystem.getBidByIndex(i);
  }

  revertTo(i) {
    this.biddingSystem.revertBiddingToRound(i);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
  }

  revertBiddingTo(b) {
    this.biddingSystem.revertBiddingToBid(b);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
  }

  ///
  getAnchors() {
    this.anchors = this.biddingSystem.findAllAnchors();
    this.keys = Array.from(this.anchors.keys());
  }

  addAnchor(i) {
    this.biddingSystem.addAnchor(i);
    this.getAnchors();
  }

  removeAnchor(i) {
    this.biddingSystem.removeAnchor(i);
    this.getAnchors();
  }

  hasAnchor(i) {
    var obid = this.getBid(i);
    return obid[1]["Anchor"] != undefined;
  }

  //// Links
  isLinked(i) {
    return this.biddingSystem.linkExist(this.getBid(i)[1]);
  }

  getLinkedDesc(i) {
    if (this.isLinked(i))
      return this.biddingSystem.getLinkedNode(this.getBid(i)[1])["Desc"];
    else
      return "";
  }

  removeLinkFromBid(i) {
    if (this.biddingSystem.linkExist(this.getBid(i)[1]))
      this.biddingSystem.detachAnchorFromNode(this.getBid(i)[1]);
  }

  materializeLinkAtBid(i) {
    console.log(this.getBid(i)[1]);
    if (this.biddingSystem.linkExist(this.getBid(i)[1]))
      this.biddingSystem.materialAnchorAtNode(this.getBid(i));
  }

  // getAttachedDesc(i) {
  //   if (this.isAttached(i))
  //       return this.biddingSystem.getAttachedNode(this.getBid(i)[1])["Desc"];
  //   else 
  //       return "";
  // }

  // isAttached(i) {
  //   return this.biddingSystem.followIsAttachedNode(this.getBid(i)[1]);
  // }

  startBidding() {
    this.possibleBids = this.biddingSystem.startBidding();
  }

  startRootBidding() {
    this.possibleBids = this.biddingSystem.startRootBidding();
  }

  addBid() {
    this.biddingSystem.addBidToCurrentNode(this.bid, this.desc);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
    this.bid = "";
    this.desc = "";
  }

  removeBid(i) {
    this.biddingSystem.removeBidFromCurrentNode(this.getBid(i)[0]);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
    this.anchors = this.biddingSystem.findAllAnchors();
  }


  attachAnchor(anchor) {
    this.biddingSystem.attachAnchorToCurrentNode(anchor);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();// why was this commented out?
  }

  processFile(jsonInput: any) {
    const file: File = jsonInput.files[0];
    this.bsName = file.name;
    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      var data: string | ArrayBuffer;
      data = fileReader.result
      this.biddingSystem.systemHierarchy = JSON.parse(data.toString());
      localStorage.setItem('system', data.toString());
      this.startBidding();
    }
    fileReader.readAsText(file);
  }

  showBiddingSystemAsJson() {
    var we = window.open("", "hallo");
    we.document.write(JSON.stringify(this.biddingSystem.systemHierarchy));
  }

  downloadSystem() {
    var text = JSON.stringify(this.biddingSystem.systemHierarchy);
    var we = window.open("", "hallo");
    we.document.write(text);

    var blob = new Blob([text], { type: 'text/plain' });
    var anchor = document.createElement('a');
    anchor.download = this.bsName;
    anchor.href = (window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }

  newSystem() {
    this.biddingSystem.newSystem();
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids();
  }


}
