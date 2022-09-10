import LoserItemSheetBase from "./base-sheet.js";

// This class provides core functionality for the Weapon Item Sheet
export default class LoserWeaponItemSheet extends LoserItemSheetBase {
  constructor(...args) {
    super(...args);
  }

  //Configure some defaults specific to this sheet
  //@override LoserItemSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("weapon")
    return options;
  }
  
  //Returns data to the template (item sheet HTML and CSS) for rendering
  //@Override LoserItemSheetBase
  async getData(options) {
    
    //get base context - everything needed to render any item
    const context = await super.getData(options);
       
    //establish armor properties names - this is... inelegant but should work for now
    const propertyNames =  ["Blunt", "Brace", "Charge", "Missile", "Off-hand", "Reach", "Small", "Two-handed", "Weak", "Versitile"];

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      propertyNames: propertyNames
    });

    return context;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override ItemSheet
  get template(){
    return "systems/loser/templates/items/weapon-sheet.html";
  }
}