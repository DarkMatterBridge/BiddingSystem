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
  http: HttpClient;
  possibleBids: any;

  bid: string;
  desc: string;

  constructor(http: HttpClient) { this.http = http }

  ngOnInit() {
    this.biddingSystem = new BiddingSystem(this.http);
    this.biddingSystem.loadSystem().subscribe(
      (data: any) => {
        this.possibleBids = this.biddingSystem.currentPossibleBids;
      }
    );
    this.bidding = new Bidding();
  }

  select(i) {
    this.biddingSystem.selectBid(this.biddingSystem.getBidByIndex(i));
    this.bidding.addBid(this.biddingSystem.getCurrentBid());
    this.possibleBids = this.biddingSystem.currentPossibleBids;
//    this.possibleBids = this.biddingSystem.getCurrentPossibleBids_();
    if (this.possibleBids.length == 0) {
       this.anchors = this.biddingSystem.findAllAnchors();
        this.keys =  Array.from(this.biddingSystem.anchors.keys()); //   Object.keys(this.anchors);
        }
    } 

  revertTo(i) {
    this.biddingSystem.currentNode = this.bidding.getBid(i)[1];
    this.bidding.cutBidding(i);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids_();
  }

  addAnchor(i) {

    var obid = this.biddingSystem.getBidByIndex(i);
    obid[1]["Anchor"] = this.biddingSystem.maxAnchor + 1; 
    this.biddingSystem.findAllAnchors(); 
  }

  hasAnchor(i) {
    var obid = this.biddingSystem.getBidByIndex(i);
      return obid[1]["Anchor"] != undefined;
  }

  startBidding() {
    this.possibleBids = this.biddingSystem.startBidding();
    this.bidding.cutBidding(-1);
  }

  addBid() {
    this.biddingSystem.addBidToCurrentNode(this.bid, this.desc);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids_();
    this.bid = "";
    this.desc = "";
  }


  attachAnchor(anchor) {
    this.biddingSystem.attachAnchorToCurrentNode(anchor);
    this.possibleBids = this.biddingSystem.getCurrentPossibleBids_();
  }

  processFile(jsonInput: any) {
    const file: File = jsonInput.files[0];
    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      var data: string | ArrayBuffer;
      data = fileReader.result
      this.biddingSystem.systemHierarchy = JSON.parse(data.toString());
      this.possibleBids = this.biddingSystem.getCurrentPossibleBids_();
      this.bidding.cutBidding(-1);
    }
    fileReader.readAsText(file);
  }

  showBiddingSystemAsJson() {
    var we = window.open("", "hallo");
    we.document.write(JSON.stringify(this.biddingSystem.systemHierarchy));
  }

  downloadSystem() {
    var text = JSON.stringify(this.biddingSystem.systemHierarchy);
    var blob = new Blob([text], { type: 'text/plain' });
    var anchor = document.createElement('a');
    anchor.download = "bs.json";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }


}
