import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { stringify } from '@angular/core/src/util';


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
    this.props = Object.getOwnPropertyNames(this.bsBranch);
  }

  select(x) {

    var bidFromPrevAfterFolllow = null;
    if (this.biddingRoot === "")
      this.biddingRoot = x;
    var bid = this.bsBranch[x];  // get node for bid 

    if (!bid && this.bsBranchAfterFollow) {
      bid = this.bsBranchAfterFollow[x];
    }
 
    if (!bid["Follow"]) {
      if (!this.editMode)
        return null;  // mach nix falls keine weiteren Gebote vorhanden
      else {
        this.bsBranch[x]["Follow"] = {};
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
      this.props = null;
      var a = this.getPossibleBids(this.bsBranch);
      var b = this.getPossibleBids(this.bsBranchAfterFollow);
      this.props = [].concat(a,b);
      this.mixBidsFromBranchAfterFollow = false;
    }

    this.bsBranchAfterFollow = bid["AfterFollow"];
    if (this.bsBranchAfterFollow) {
      this.mixBidsFromBranchAfterFollow = true;
      console.log(this.bsBranchAfterFollow);
    }

    this.bidding.push([x, meaning]);
    this.nodes.set(x, this.bsBranch);
  }

  revertBidding(i) {
    this.bsBranch = this.nodes.get(this.bidding[i][0]);
    this.props = Object.getOwnPropertyNames(this.bsBranch);
    this.bidding.splice(i + 1, 100);
  }


  reset() {
    this.bsBranch = this.bs;
    this.props =  this.getPossibleBids(this.bsBranch);  
    this.bidding = [];
    this.biddingRoot = "";
  }

  startBidding() {
    this.bsBranch = this.bs["opening"]["Follow"];
    this.props =  this.getPossibleBids(this.bsBranch);  
    this.bidding = [];
    this.biddingRoot = "opening";
  }
  
  getPossibleBids(branch: any) {
    console.log(branch);
    return Object.getOwnPropertyNames(branch).map(bid => [bid,branch[bid]['Desc']]);
  }


  configUrl = 'assets/bridgePrecision.json';

  load() {
    this.getConfig().subscribe(
      (data: any) => {
        this.bs = data;
        this.reset();
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

  add() {
    this.bsBranch[this.bid] = { 'Desc': this.desc };
    this.props = Object.getOwnPropertyNames(this.bsBranch);
    this.bid = "";
    this.desc = "";
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
