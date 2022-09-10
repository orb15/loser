import LoserActorSheetBase from "./base-sheet.js";
import Utils from "../../utils.js"

// This class provides core functionality for the Character and NPC
// Character Sheets
export default class LoserDomesticatedSheet extends LoserActorSheetBase {
  
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

    //load the dataCache, which will be the context object from the base class, accessible via this.dataCache after
    //the call below this comment
    super.getData()

    //prep the inventory - divide by catagory and sort appropriately
    const allItems = this.dataCache.source.items;
    const inventory = this._prepareInventory(allItems)

    //total weight carried by a monster
    const totalWeightCarried = inventory.armor.weight + inventory.currency.weight + inventory.equipment.weight + 
    inventory.loot.weight + inventory.weapon.weight + inventory.logistics.weight;

    //total amount of currency carried by monster
    const totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //build "capabilities" data - basically Features and Spells as everything else is Inventory
    const capabilities = this._buildCapabilities(allItems);

    //add additional items to the context
    foundry.utils.mergeObject( this.dataCache, {
      inventory: inventory,
      totalWeightCarried: totalWeightCarried,
      totalCurrency: totalCurrency,
      capabilities: capabilities
    });

    //use info in context to calculate movement
    this._calculateMovement();
    
    //return the dataCache, which is an context object enhanced by the calcs in this method and potentially elsewhere
    return this.dataCache;
  }
  
  //returns the path to the HTML-based character sheet.
  //@Override LoserMonsterSheetBase
  get template(){
    return "systems/loser/templates/actors/character-sheet.html";
  }

  //Establish listeners for events on the character sheet
  //@Override Application
  activateListeners(html) {

    //Capabilities - Click
    html.find(".event-capability-img").click(this._onShowItem.bind(this));

    //Logistics - Click
    html.find(".event-logistics-img").click(this._onShowItem.bind(this));
      
    //establish default listeners
    super.activateListeners(html);
  }

   //hanlder when an item is dropped on this sheet
   //@Override <Unknown - undocumented API?>
   async _onDropItemCreate(item) {


    let msg = "";

    //prevent the beast from going over the weight limit
    const itemWeight = item.system.weight;
    if (itemWeight + this.dataCache.totalWeightCarried > this.dataCache.system.baseCarry * 2) {
      msg = "This item would exceed the beast's max carry limit";
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //friendly reminder that the beast is Encumbered but not yet at limit
    if (itemWeight + this.dataCache.totalWeightCarried > this.dataCache.system.baseCarry) {
      ui.notifications.warn(`Carrying this item will make the beast Encumbered!`);
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

    //sort the features and spells independently
    capabilities["feature"].features.sort(this._capabilitySorter);
    capabilities["spell"].spells.sort(this._capabilitySorter);

    return capabilities;
  }

  //sort capability by name
  _capabilitySorter(a,b) {

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName > bName) {return 1;}
    if (bName > aName) {return -1;}

    return 0;
  }

  /* -------------------------------------------------------------
    Event Handlers
  ----------------------------------------------------------------*/
  _onSpellCast(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    this.displayChatMessageForSpellcasting(item, false, event.ctrlKey);
  }

  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/
  _calculateMovement() {
    let moveRates = [];

    const totalWeightCarried = this.dataCache.totalWeightCarried;
    const baseTactical = this.dataCache.system.baseMoveTactical;
    const baseOverland = this.dataCache.system.baseMoveOverland;
    const baseCarry = this.dataCache.system.baseCarry;

    let tactical = 0;
    let overland = 0;

    if(totalWeightCarried <= baseCarry) {
      tactical = baseTactical
      overland = baseOverland
    } else if (totalWeightCarried <= baseCarry * 2) {

      //cut available move in half
      tactical = Utils.calcHalfTacticalMovement(baseTactical)
      overland = Math.floor(baseOverland / 2);
    }
   
    this.dataCache.moveTactical = tactical;
    this.dataCache.moveOverland = overland;
  }

}