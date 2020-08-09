import { Hand } from './hand';

export class Condit {

  public eva1: Function;

  lowPoints = 0;
  highPoints = 30;

  constructor() {
  }

  check(hand: Hand): boolean {
    return this.eva1(hand);
  }

  parseConditionWorker(cond: string): Function {

    let f1 = this.parseForAnd(cond)
    if (f1 != null) return f1;

    f1 = this.parseForSuit(cond)
    if (f1 != null) return f1;

    f1 = this.parseForPlus(cond)
    if (f1 != null) return f1;

    f1 = this.parseForMinus(cond)
    if (f1 != null) return f1;

    f1 = this.parseForInterval(cond)
    if (f1 != null) return f1;

    return null;

  }

  parseConditionNew(cond: string): boolean {

    let ff = this.parseConditionWorker(cond);
    this.eva1 = ff;
    return ff != null;
  }

  parseCondition(cond: string): boolean {

    let f1 = this.parseForPlus(cond)
    if (f1 != null) {
      this.eva1 = f1;
      return true;
    }
    if (this.parseForInterval(cond))
      return true;
    return false;
  }

  parseForAnd(cond: string): Function {

    var regex = /(.+)(with|,)(.*)/;
    var a = regex.exec(cond);
    if (a != null) {
      let evax = a[1];
      let evay = a[3];
      var e1 = this.parseConditionWorker(evax);
      var e2 = this.parseConditionWorker(evay);
      var e3 = (hand) => e1(hand) && e2(hand)
      return e3
    } else return null;

  }

  parseForPlus(cond: string): Function {

    var regex = /(\d+)\+/;
    var a = regex.exec(cond);
    var f1: Function;

    if (a != null) {
      this.lowPoints = +a[1];
      f1 = (hand) => hand.points() >= this.lowPoints;
      return f1
    } else return null;
  }

  parseForMinus(cond: string): Function {

    var regex = /(\d+)\-$/;
    var a = regex.exec(cond);
    var f1: Function;

    if (a != null) {
      this.highPoints = +a[1];
      f1 = (hand) => hand.points() <= this.highPoints;
      return f1
    } else return null;
  }

  parseForSuit(cond: string): Function {

    var regex = /(\d+)(\+|\-)?(S|H|D|C)/;
    var a = regex.exec(cond);
    var f1: Function;

    if (a != null) {
      var length = +a[1];
      var suit = a[3];
      var suitNo = 0;
      if (suit == "S") suitNo = 3;
      if (suit == "H") suitNo = 2;
      if (suit == "D") suitNo = 1;
      if (suit == "C") suitNo = 0;
      if (a[2] == "+")
        f1 = (hand) => hand.cardsInSuit[suitNo] >= length;
      else if (a[2] == "-")
        f1 = (hand) => hand.cardsInSuit[suitNo] <= length;
      else
        f1 = (hand) => hand.cardsInSuit[suitNo] == length;
      return f1
    } else return null;
  }

  parseForInterval(cond: string): Function {

    var regex = /(\d+)\-(\d+)/;
    var a = regex.exec(cond);

    if (a != null) {
      this.lowPoints = +a[1];
      this.highPoints = +a[2];
      var f1 = (hand) => (hand.points() >= this.lowPoints) && (hand.points() <= this.highPoints);
      return f1;
    } else return null;

  }


}