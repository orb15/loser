import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Equipment Item Sheet
export default class LoserEquipmentItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {});
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base item data
    const data = await super.getData(options);
    
    //add the LOSER config to make building select boxes easy
    data.data.config = CONFIG.LOSER;
    
    return data;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/equipment-sheet.html";
  }
}