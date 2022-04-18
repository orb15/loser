import Utils from "../../utils.js"

// This class provides core functionality for the all Item Sheets
export default class LoserItemSheetBase extends ItemSheet {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override ItemSheet
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 600,
      height: 400,
      classes: ["loser", "sheet", "item"],
      resizable: true,
    });
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override Application
  async getData(options) {
    
    //get base item data - this is whack. I am using the 5e approach here
    const data = super.getData(options);
    
    //itemData.data holds the template information (weirdly) yet it is accessed by the template 
    //via data.<var>. This is why I have itemData.data = <val> everywhere below. These
    //gyrations allow me to reference all of the template and calculated data as data.<x>
    //in the template. I spent far too long sorting this out in the debugger since the 5e stuff
    //didn't seem to be working for me exactly as I expected. I guess this is a hybrid approach?
    const itemData = data.data;  

    itemData.data.usesUnitSlot = false;
    itemData.data.usesQtyPerSlot = false;
    
    //track if an item has slots, and if so, does it use unit slot or qty/slot approach
    if (itemData.data.hasOwnProperty("qty") || itemData.type === "currency" || itemData.type === "logistic") {
      itemData.data.hasSlots = true
      if (itemData.data.unitSlot > 0) {
        itemData.data.usesUnitSlot = true;
      }
      if (itemData.data.qtyPerSlot > 0) {
        itemData.data.usesQtyPerSlot = true;
      } 
    } else {
      itemData.data.hasSlots = false
    }
      
    //note this item type
    itemData.data.itemType = itemData.type.titleCase();
    
    //calc slot weight of this item (if any)
    itemData.data.slots =  Utils.calcSlots(itemData);
    
    // Re-define the template data references (backwards compatible)
    data.item = itemData;
    data.data = itemData.data;
    
    return data;
  }
  
}