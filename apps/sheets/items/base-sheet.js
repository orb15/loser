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
    
    //get base data for item and load it into a 'context' - a construct for holding all
    //needed info for the template
    const context = super.getData(options);

    //obtain the base item (for access to item.img and item.name and anything else on the item object)
    const item = context.item;

    //note this item type
    const itemType = item.type.titleCase();

    //calc weight of this item (if any)
    const totalWeight =  Utils.calcSlots(item);

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: item.system, //this is the data from the template!
      source: item,
      itemType: itemType,
      totalWeight: totalWeight
    });

    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself. So to display the item qty (a LoseR-specific value
    //defined in the Loser template.json file), handlebars needs to refer to system.qty and not context.system.qty
    return context;
  }

}