import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Equipment Item Sheet
export default class LoserArmorItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("armor");
    options.height = 430;
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base item data
    const data = await super.getData(options);
    
    //establish armor properties names - this is... inelegant but should work for now
    data.data.propertyNames = ["Shield", "Light", "Medium", "Heavy"];
    return data;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/armor-sheet.html";
  }
}