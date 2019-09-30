import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { stringify } from '@angular/core/src/util';
import { BiddingState } from '../model/BiddingState';


@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  constructor(private http: HttpClient) { }
  bs: any; // bridge system
  bsBranch: any;
  bsBranchAfterFollow: any;
  props: any;

  bidding: Array<any>;
  nodes = new Map();
  biddingSteps = 0;

  biddingSystem: any;

  editMode = false;
  bid: string;
  desc: string;

  static symbols = ['♣', '♦', '♥', '♠'];
  symbols = new Map();

  biddingRoot = "";
  mixBidsFromBranchAfterFollow = false;
  tryBidSelectFromBranchAfterFollow = false;

  rbs: any;
  lastBid: any;

  biddingState: BiddingState;

//  biddingstate = {currentnode: any, currentbid: string, nextBidNodes : any};


  ngOnInit() {

    this.symbols.set("C", '♣');
    this.symbols.set("D", '♦');
    this.symbols.set("H", '♥');
    this.symbols.set("S", '♠');
    this.symbols.set("N", 'NT');

    this.bs =
      {
        "1C": {
          "Desc": "16+",
          "Form": "P>15",
          "Sit": "1CLUB",
          "Follow": {
            "1D": {
              "Desc": "0-7",
              "Form": "0<=P<8",
              "Sit": "S.1C1D"
            },
            "1H": {
              "Desc": "8-11",
              "Form": "0<=P<8",
              "Follow": {
                "1S": "4+Spades"
              }
            },
            "1S": {
              "Desc": "8+, 5+Spades"
            },
            "1N": {
              "Desc": "12+, 5+Clubs"
            },
            "2C": {
              "Desc": "12+, 5+Diamonds"
            },
            "2D": {
              "Desc": "12+, 5+Heats"
            }
          },
          "FollowOpponentBidding": {
            "X": "5-7",
            "nS": "5+nS"
          }
        },
        "2T": {
          "Desc": "11-15, 6+C",
          "Follow": {
            "2D": "Asking"
          }
        },
        "2N": {
          "Desc": "22-23, bal.",
          "Prio": 100,
          "Follow": {
            "3T": "Puppett"
          }
        }
      };

    this.load();
  }

  delete(x) {
    delete this.bsBranch[x];
    this.props = this.props.filter( p => p[0]!=x);
//    this.props = this.getPossibleBids(this.bsBranch);
  }

  select(x) {

    if (this.biddingRoot === "")
      this.biddingRoot = x;
    var bid = this.bsBranch[x];  // get node for bid 

    if (bid === undefined && this.tryBidSelectFromBranchAfterFollow) {
      console.log(this.bsBranchAfterFollow);
      alert("select bid in branch after follow")
      bid = this.bsBranchAfterFollow[x];
      this.tryBidSelectFromBranchAfterFollow = false;
    }
    this.lastBid = bid;
   
    if (bid["Follow"] === undefined) {
      alert("no follow")
      if (!this.editMode)
        return null;  // mach nix falls keine weiteren Gebote vorhanden
      else {
        //        this.bsBranch[x]["Follow"] = {};
        alert("new follow branch")
        bid["Follow"] = {};
      }
    }
    var meaning = bid["Desc"];

    if (typeof bid["Follow"] === 'string') {
      this.biddingRoot = bid["Follow"];
      this.bsBranch = this.bs[this.biddingRoot]['Follow'];
    } else {
      this.bsBranch = bid["Follow"];
    }

    this.props = this.getPossibleBids(this.bsBranch);
    if (this.mixBidsFromBranchAfterFollow) {
      alert("mix bids");
      this.props = null;
      var a = this.getPossibleBids(this.bsBranch);
      var b = this.getPossibleBids(this.bsBranchAfterFollow);
      this.props = [].concat(a, b);
      this.mixBidsFromBranchAfterFollow = false;
      this.tryBidSelectFromBranchAfterFollow = true;
    } else {
      this.bsBranchAfterFollow = bid["AfterFollow"];
      if (this.bsBranchAfterFollow)
        this.mixBidsFromBranchAfterFollow = true;
    }

    this.bidding.push([x, meaning]);
    this.nodes.set(x, this.bsBranch);
    this.rbs = this.getRootBranches();
  }

  
  revertBidding(i) {
    this.bsBranch = this.nodes.get(this.bidding[i][0]);
    this.props = this.getPossibleBids(this.bsBranch);
    this.bidding.splice(i + 1, 100);
  }


  reset() {
    this.bsBranch = this.bs;
    this.props = this.getPossibleBids(this.bsBranch);
    this.bidding = [];
    this.biddingRoot = "";
    this.mixBidsFromBranchAfterFollow = false;
    this.tryBidSelectFromBranchAfterFollow = false;
  }

  startBidding() {
    this.bsBranch = this.bs["opening"]["Follow"];
    this.props = this.getPossibleBids(this.bsBranch);
    this.bidding = [];
    this.biddingRoot = "opening";
    this.mixBidsFromBranchAfterFollow = false;
    this.tryBidSelectFromBranchAfterFollow = false;
  }

  getPossibleBids(branch: any) {
    return Object.getOwnPropertyNames(branch).map(bid => [bid, branch[bid]]);
  }

  configUrl = 'assets/bridgePrecision.json';

  load() {
    this.getConfig().subscribe(
      (data: any) => {
        this.bs = data;
        this.startBidding();
      }
    );
  }

  newSystem() {
    this.bs = { "opening": { "Follow": { "1c": { "Desc": "...." } } } };
    this.reset();
  }

  private getConfig() {
    return this.http.get(this.configUrl);
  }

  downloadSystem() {
    this.biddingSystem = JSON.stringify(this.bs);
    var we = window.open("", "hallo");
    we.document.write(this.biddingSystem);

    var text = this.biddingSystem,
      blob = new Blob([text], { type: 'text/plain' }),
      anchor = document.createElement('a');

    anchor.download = "bs.json";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }

  changeText() {
  }


  getRootBranches() {
    return Object.getOwnPropertyNames(this.bs);
  }
  add() {
    this.bsBranch[this.bid] = { 'Desc': this.desc };
    this.props = this.getPossibleBids(this.bsBranch);
    this.bid = "";
    this.desc = "";
  }

  attachRouteBranch(rb) {
    console.log(this.lastBid);
    this.lastBid['Follow'] = rb;
    console.log(this.lastBid);
  }

  detachRouteBranch(x) {
    var bid = this.bsBranch[x];  // get node for bid 
    this.lastBid['Follow'] = {}
  }
 
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const fileReader = new FileReader();

    fileReader.onload = fileLoadedEvent => {
      var datae: string | ArrayBuffer;
      datae = fileReader.result
      this.bs = JSON.parse(datae.toString());
      this.reset();
    }

    fileReader.readAsText(file);

  }



}
