import LoserActorSheetBase from "./base-sheet.js";

// This class provides core functionality for the Character and NPC
// Character Sheets
export default class LoserMonsterSheet extends LoserActorSheetBase {
  
  constructor(...args) {
    super(...args);
  }
  
  /* -------------------------------------------------------------
    Overrides and Core Methods
  ----------------------------------------------------------------*/

  //Configure some defaults specific to this sheet
  //@override LoserActorSheetBase
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("playable")
    return options;
  }
  
  //Returns data to the template (character sheet HTML and CSS) for rendering
  //@Override LoserActorSheetBase
  getData() {
    
    //start with baseline data
    const data = super.getData()

    //note the items carried by the character for use elsewhere
    let allItems = data.actor.items;

    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(allItems)

    //total weight carried by a monster
    data.data.totalWeightCarried = inventory.armor.weight + inventory.currency.weight + inventory.equipment.weight + 
    inventory.loot.weight + inventory.weapon.weight;
    data.data.inventory = inventory;

    //total amount of currency carried by monster
    data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //build "capabilities" data - basically Features and Spells as everything else is Inventory
    data.data.capabilities = this._buildCapabilities(data.actor.items);

    return data;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override LoserActorSheetBase
  get template(){
    return "systems/loser/templates/actors/character-sheet.html";
  }
  
  //Establish listeners for events on the character sheet
  //@Override Application
  activateListeners(html) {
      
    //Capabilities - Click
    html.find(".event-capability-img").click(this._onShowItem.bind(this));

    //establish default listeners
    super.activateListeners(html);
  }

   //hanlder when an item is dropped on this sheet
   //@Override <Unknown - undocumented API?>
   async _onDropItemCreate(item) {

    //check dragged item type and conditionally reject it
    let validType = true;
    let msg = "";
    switch(item.type) {

      case "logistic":
        validType = false; //logistics are never allowed on monsters
        msg = "This type not allowed on Monsters";
        break;
    }

    //prevent monster from adding an invalid type of item
    if(!validType) {
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //default to the handler to create the embedded document
    super._onDropItemCreate(item);
   }

  /* -------------------------------------------------------------
    Capabilities
  ----------------------------------------------------------------*/
  _buildCapabilities(allItems) {

    const capabilities = {
      "feature": {"features":[], "type": "feature"},
      "spell": {"spells":[], "type": "spell"},  
    };

    allItems.map(item => {
      switch(item.type) {

        case "feature":
          capabilities["feature"].features.push(item);
          break;

        case "spell":
          capabilities["spell"].spells.push(item);
          break;
      }

    });

    //sort the spells
    capabilities["feature"].features.sort(this._capabilitySorter);
    capabilities["spell"].spells.sort(this._capabilitySorter);

    return capabilities;
  }

  //sort spells by name
  _capabilitySorter(a,b) {

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName > bName) {return 1;}
    if (bName > aName) {return -1;}

    return 0;
  }

  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/

}