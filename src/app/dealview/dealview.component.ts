import { Component, OnInit } from '@angular/core';
import { DealService } from '../deal.service';
import { Condit } from '../model/condit';

@Component({
  selector: 'app-dealview',
  templateUrl: './dealview.component.html',
  styleUrls: ['./dealview.component.css']
})
export class DealviewComponent implements OnInit {

  cards: any;
  directions = [0, 1, 2, 3];
  cardsDirection: any;
  hands: any;

  condition1: string;
  counter = 0;

  constructor(private dealservice: DealService) { }

  ngOnInit() {
    this.init();
  }

  init() {

    let p = 0, q = 0;

    let bal = false;
    let condition = new Condit();
    condition.parseConditionNew('5+S, 4+D with 15+');

    do {
      this.newDistribution();
      p = this.hands[0].points();
      q = this.hands[2].points();
      bal = this.hands[0].isBalanced();

    } while (!(condition.check(this.hands[0]) && q > 7 && !bal))
  }

  newDistribution() {
    this.dealservice.shuffle();
    this.dealservice.distribute();
    this.dealservice.sortHands();
    this.hands = this.dealservice.hands;
  }

  generateDeal() {
    let condition = new Condit();
    condition.parseConditionNew(this.condition1);
    this.counter = 0;
    do {
      this.counter++;
      this.newDistribution();
    } while (!(condition.check(this.hands[0])))

  }

}

// yaml2json bridgePrecion.yaml --pretty > src\assets\bridgePrecision.json
