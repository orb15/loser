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

    //total slots carried by a character
    data.data.totalSlots = inventory.armor.slots + inventory.currency.slots + inventory.equipment.slots + 
    inventory.loot.slots + inventory.weapon.slots + inventory.logistics.slots;
    data.data.inventory = inventory;

    //total amount of currency carried by character
    data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //build "capabilities" data - everything but core inventory
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
    Event Handlers
  ----------------------------------------------------------------*/
  _onRollSaveTest(event) {
    event.preventDefault();
    let save = event.currentTarget.dataset.save;
    let targetValue = event.currentTarget.nextElementSibling.value
    console.log("Making a " + save + " Saving Throw with target: " + targetValue);
  }
  
  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    return item.sheet.render(true);
  }

  _onItemDelete(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    if ( item ) return item.delete();
  }


  _onSpellCast(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    this.displayChatMessageForSpellcasting(item, false, event.ctrlKey);
  }

  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/

}