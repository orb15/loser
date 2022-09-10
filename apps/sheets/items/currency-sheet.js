import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Currency Item Sheet
export default class LoserCurrencyItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("currency")
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base context - everything needed to render any item
    const context = await super.getData(options);
    
    //no currency-specific data is required, so return the base context
    return context;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/currency-sheet.html";
  }
}