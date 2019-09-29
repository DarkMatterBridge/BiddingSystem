import { Injectable } from '@angular/core';
import { Hand } from './model/hand';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  cards:number[];
  suit = ['Treff', 'Karo', 'Herz', 'Pik'];
  value = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K', 'A'];
  
  cardsDirection:number[][];
  hands: Hand[];


  constructor() {

   this.cards = new Array(52);
   this.cardsDirection = new Array(4);
   this.cardsDirection[0]  = new Array(13);
   this.cardsDirection[1]  = new Array(13);
   this.cardsDirection[2]  = new Array(13);
   this.cardsDirection[3]  = new Array(13);

   this.hands = new Array(4);
   this.hands[0] = new Hand();
   this.hands[1] = new Hand();
   this.hands[2] = new Hand();
   this.hands[3] = new Hand();


   for( var i= 0; i< this.cards.length; i++) {
     this.cards[i]= i;
   }
    


 }

cardValue  (c: number) {
  let n = c % 13 ;
  let suit:number = Math.floor(c/13);
  return this.suit[suit]+this.value[n]; 
}

shuffle() {
  for( var i= 0; i< this.cards.length ; i++) {
    var z = Math.floor(Math.random()*(this.cards.length-i)+i);
    console.log(z);
    let cardS = this.cards[z];
    this.cards[z]=  this.cards[i];
    this.cards[i]=  cardS;
    
  }
}

distribute() {
  for (var direction = 0; direction <4; direction++)
    for( var i= 0; i< 13; i++) {  
       this.cardsDirection[direction][i] = this.cards[i+13*direction]; 
       this.hands[direction].cards[i] =  this.cards[i+13*direction];
      }
}

sortHands() {
  for (var direction = 0; direction <4; direction++) {
    this.cardsDirection[direction].sort((i,j) => (j-i));
    this.hands[direction].sort();
  }
}


}
