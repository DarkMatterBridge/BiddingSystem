export class Hand {

    cards: number[];

    static suit = ['Treff', 'Karo', 'Herz', 'Pik'];
    static symbols = ['♣', '♦', '♥', '♠'];
    static value = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K', 'A'];
  
    cardsInSuit: number[];

    constructor() {
        this.cards = new Array(13);
    }

    points() {
      return  this.cards.reduce((sum,b) => sum + Math.max(Math.floor(b%13)-8,0), 0 );
    }
    
    isBalanced():boolean {
        // 5332 90   4221 16
        // 4333 108  3222 24
        // 4432 96   3321 18
         // 6322 72   5211 10
        // 5422 80   4311 12
        if (this.cardsInSuit == null)
           this.detCardsInSuit();
        return this.cardsInSuit[3]*this.cardsInSuit[2]*this.cardsInSuit[1]*this.cardsInSuit[0] > 89 ;
    }

    detCardsInSuit() {
       this.cardsInSuit  = [0,0,0,0];
       this.cards.forEach(n => {
           this.cardsInSuit[Math.floor(n/13)]++;
       }); 
    }

    sort() {
     this.cards.sort((i,j) => (j-i));
     this.cardsInSuit  = [0,0,0,0];
     this.detCardsInSuit();
    }

    printHand() {
        let suit = 3;
        let out = Hand.symbols[suit]+":"; 
        let symbol ="x";
        let o = "pik";

        for ( let i = 0; i< 13; i++) {
            if ( this.cards[i] < suit*13 ){
                suit = suit - 1;
                symbol = Hand.symbols[suit];
                out = out +  " " + symbol +":";  
            }
            out = out + this.cardValue(this.cards[i])
        } 
        out = out + "/"+this.cardsInSuit[3]+this.cardsInSuit[2]+this.cardsInSuit[1]+this.cardsInSuit[0];
        return out;
    }

    print(suit) {
       let out = ""; 
       for ( let i = 0; i< 13; i++) {
           if (this.cards[i] < suit*13+13 || this.cards[i] >= suit*13 )
              out = out + this.cardValue(this.cards[i])
       } 
       return out;
    }

    cardValue  (c: number) {
        let n = c % 13 ;
        return Hand.value[n]; 
      }
      
}