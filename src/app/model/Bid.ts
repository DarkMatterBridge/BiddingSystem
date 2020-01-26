import { devModeEqual } from '@angular/core/src/change_detection/change_detection';

// Real Bid

export class Bid {

    level: number; 
    denomination: string;
    direction: number ; // 0>North; 1 > East, 2> South, 3> West

    constructor(bidname: String) {

    }

    name() {
        return this.level+this.denomination;
    }

}

