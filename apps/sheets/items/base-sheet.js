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
    //data.data seems to work for other documents but items need this weird treatment
    //also see return below
    const data = super.getData(options);
    const itemData = data.data;
       
    //note this item type
    itemData.data.itemType =itemData.type.titleCase();

    //handle various ways in which encumbrance can be calculated
    //this approach allows a new item (which is always non-zero in each field we care about here)
    //to show all relevant boxes, but as the item is customized, the item sheet updates to show
    //only relevant input fields
    itemData.data.usesUnitSlot = itemData.data.unitSlot > 0 ? true :false;
    itemData.data.usesQtyPerSlot = itemData.data.qtyPerSlot > 0 ? true : false;
    itemData.data.hasResourceDie = itemData.data.resourceDie >= 0 ? true : false;  //resource die might be 0 when resource is empty
    itemData.data.hasSlots = false;

    if(itemData.data.usesUnitSlot ||itemData. data.usesQtyPerSlot) {
      itemData.data.hasSlots = true;
    }

    
    //calc slot weight of this item (if any)
    if(itemData.data.hasSlots) {
      itemData.data.slots =  Utils.calcSlots(itemData);
    } else {
      itemData.data.slots = 0;
    }

    // Re-define the template data references (backwards compatible)
    // more 5e weirdness copied from the 5e 'sheet.js' base class
    data.item = itemData;
    data.data = itemData.data;
    return data;
  }

}