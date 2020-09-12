import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bid-symbol',
  templateUrl: './bid-symbol.component.html',
  styleUrls: ['./bid-symbol.component.css']
})
export class BidSymbolComponent implements OnInit {

  @Input() bid: string;

  level: string;
  suit: string
  class = "black";
  symbol = "";

  symbols = ['♣', '♦', '♥', '♠', 'NT'];

  constructor() { }

  ngOnInit() {
    this.level = this.bid.substring(0, 1);
    this.symbol = this.bid.substring(1,200);

    if (this.bid.trim().length === 2 ) {
      this.suit = this.bid.substring(1, 2);

      if (this.suit == "H" || this.suit == "D")
        this.class = "red";
      if (this.suit == "C" || this.suit == "S")
        this.class = "blue";

        this.symbol = this.suit;

        switch (this.suit) {
        case "C":
          this.symbol = this.symbols[0];
          break;
        case "D":
          this.symbol = this.symbols[1];
          break;
        case "H":
          this.symbol = this.symbols[2];
          break;
        case "S":
          this.symbol = this.symbols[3];
          break;
        case "N":
        case "NT":
          this.symbol = this.symbols[4];
      }
    }

  }

}
