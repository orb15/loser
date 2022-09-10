import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Armor Item Sheet
export default class LoserSpellItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("spell");
    options.height = 430;
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base context - everything needed to render any item
    const context = await super.getData(options);
       
    //add the LOSER config to make building select boxes easy
    const config = CONFIG.LOSER;

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      config: config
    });

    return context;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/spell-sheet.html";
  }
}