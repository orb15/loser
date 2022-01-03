import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Equipment Item Sheet
export default class LoserWeaponItemSheet extends LoserItemSheetBase {
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
    
    //establish weapon properties names - this is... inelegant but should work for now
    data.data.propertyNames = ["Blunt", "Brace", "Charge", "Missile", "Off-hand", "Reach", "Small", "Two-handed", "Weak", "Versitile"];
    return data;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/weapon-sheet.html";
  }
}