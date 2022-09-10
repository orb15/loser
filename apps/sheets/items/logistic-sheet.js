import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Armor Item Sheet
export default class LoserLogisticItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("logistic");
    options.height = 430;
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base context - everything needed to render any item
    const context = await super.getData(options);
    
    //no logistic-specific data is required, so return the base context
    return context;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/logistic-sheet.html";
  }
}