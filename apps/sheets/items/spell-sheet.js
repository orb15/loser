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
    
    //get base item data
    const data = await super.getData(options);

    //add the LOSER config to make building select boxes easy
    data.data.config = CONFIG.LOSER;

    //a note on select boxes and spell levels shown in the data in console
    //there is an 'off by one issue' in that using a select box stores the 0-based
    //index as the value in the item's "level" data (or "spell list" data). So, in console
    //a spell with level: "0" means the 0th item in the select box (eg Level 1). This is more
    //obvious on the spell list, where "spell list 0" corrisponds to the first item in the LOSER
    //CONFIG spell list data, which is "druid". Note that if the LOSER data is reordered, all the
    //items referencing that data will be invalid! Don't reorder the LOSER config data!!

    return data;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/spell-sheet.html";
  }
}