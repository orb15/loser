import {LOSER} from "../config.js";

//Utils is a collection of helper functions
export default class Utils {

  //returns the number of slots consumed by an item
  static calcSlots(item, className) {

    const data = item.system;

    //non-currency items use unit weight first, or if this value is 0, base total slots on quantitity and qty per slot
    switch (item.type) {
      case "weapon":
      case "armor":
      case "equipment":
      case "loot":
        //prevent negative qty
        const qty = data.qty >= 0 ? data.qty : 0

        //calc total weight based on base weight and quantity held
        let totalWeight = data.weight * qty;
        return totalWeight;

      //currency weight is based on increments of 50 coins and 100 gems both rounded down
      case "currency":
        const coins = data.coins.gp + data.coins.sp + data.coins.cp;
        const gems = data.gems.sp10 +  data.gems.sp25 +  data.gems.sp50 + 
        data.gems.sp100 +  data.gems.sp250 +  data.gems.sp500 + 
        data.gems.sp1000 +  data.gems.sp2500 +  data.gems.sp5000;
        return Math.floor(coins / LOSER.CoinWeight.coinsPerPound) + Math.floor(gems / LOSER.CoinWeight.gemsPerPound);

      case "logistic":
        return data.weight;

      default:
        return 0
    }
  }

  //returns half tactical movement rounded down to the nearest 5ft move increment
  static calcHalfTacticalMovement(baseMovement) {
    let tactical = Math.floor(baseMovement / 2);
    if(tactical % 5 != 0) {
      const r = tactical % 10;
      if(r < 5) {
        tactical = Math.trunc(tactical / 10) * 10;
      } else {
        tactical = (Math.trunc(tactical / 10) + .5) * 10;
      }
    }
    return tactical;
  }

}

   