
//Utils is a collection of helper functions
export default class Utils {

  //returns the number of slots consumed by an item
  static calcSlots(item) {

    const data = item.data

    //prevent div by 0
    const qtyPerSlot = data.qtyPerSlot >= 1 ? data.qtyPerSlot : 1

    //prevent negative qty
    const qty = data.qty >= 0 ? data.qty : 0

    //non-currency items use unit weight first, or if this value is 0, base total slots on quantitity and qty per slot
    switch (item.type) {
      case "weapon":
      case "armor":
      case "equipment":
      case "loot":
      case "logistic":

        //unit slots are default calculation if set
        if (data.unitSlot >= 1) {
          return data.unitSlot * qty;
        }
      
        //otherwise slots are based on qty carried and the slots occupied by a qty of the items
        const raw = qty / qtyPerSlot;
        return Math.ceil(raw);

      //currency weight is based on increments of 50 coins and 100 gems both rounded down
      case "currency":
        const coins = itemData.gp + itemData.sp + itemData.cp;
        const gems = itemData.sp10 + itemData.sp25 + itemData.sp50 + 
          itemData.sp100 + itemData.sp250 + itemData.sp500 + 
          itemData.sp1000 + itemData.sp2500 + itemData.sp5000;
        return Math.floor(coins / 50) + Math.floor(gems / 100);

      default:
        return 0
    }
  }

}

   