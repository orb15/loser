import Utils from "../../utils.js"
import LoserActorSheetBase from "./base-sheet.js";

// This class provides core functionality for the Character and NPC
// Character Sheets
export default class LoserCharacterSheet extends LoserActorSheetBase {
  
  constructor(...args) {
    super(...args);
  }
  

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
    
    
    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(data.actor.items)


    // prep the info actually going to the template
    // Note the use of data.data here. Data.data is 
    // sent to the template, where it is de-referenced
    // as just 'data' to access what is stored here

    //total slots carried by a character - note that a character can't carry logistical items
    data.data.totalSlots = inventory.armor.slots + inventory.currency.slots + inventory.equipment.slots + 
      inventory.loot.slots +inventory.weapon.slots;

    data.data.inventory = inventory;

    //data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items)
    data.data.totalCurrency = 3280.68;

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
    
    //Ability Checks - onClick
    html.find(".event-ability-name").click(this._onRollAbilityTest.bind(this));
    
    //Saving Throws - onClick
    html.find(".event-saves-name").click(this._onRollSaveTest.bind(this));
    
    //Ability Score Changes - onChange
    html.find(".event-ability-value").change(this._onChangeAbilityScore.bind(this))

    //Inventory - Item Edit & Delete icons
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));


    //establish default listeners
    super.activateListeners(html);
  }


  /* -------------------------------------------------------------
     Private Methods
     -----------------------------------------------------------*/
  //organize inventory for display
  _prepareInventory(allItems) {

    //prepare an organized inventory
    const inventory = {
      "weapon": {"slots": 0,"items": [],"type": "weapon"},
      "armor": {"slots": 0,"items": [],"type": "armor"},
      "equipment": {"slots": 0,"items": [],"type": "equipment"},
      "loot": {"slots": 0,"items": [],"type": "loot"},
      "currency": {"slots": 0,"items": [],"type": "currency"},
      "logistics": {"slots": 0,"items": [],"type": "logistic"},
    }

    allItems.map(item => {

      switch(item.type) {
        case "weapon":
          inventory.weapon.items.push(item);
          inventory.weapon.slots += Utils.calcSlots(item);
          break;
        case "armor":
          inventory.armor.items.push(item);
          inventory.armor.slots += Utils.calcSlots(item);
          break;
        case "equipment":
          inventory.equipment.items.push(item);
          item.slots = Utils.calcSlots(item);
          inventory.equipment.slots += item.slots

          //note if this item has a resource die associated with it
          if (item.data.resourceDie > 0) {
            item.hasResourceDie = true
          } else {
            item.hasResourceDie = false
          }

          break;
        case "loot":
          inventory.loot.items.push(item);
          inventory.loot.slots += Utils.calcSlots(item);
          break;
        case "currency":
          inventory.currency.items.push(item);
          inventory.currency.slots += Utils.calcSlots(item);
          break;
      }
    })

    //sort the various arrays by slots used then by name
    inventory.weapon.items.sort(this._inventorySorter)
    inventory.armor.items.sort(this._inventorySorter)
    inventory.equipment.items.sort(this._inventorySorter)
    inventory.loot.items.sort(this._inventorySorter)
    inventory.currency.items.sort(this._inventorySorter)

    return inventory
  }
  
  _inventorySorter(a, b) {
    
    const aSlots = a.slots;
    const bSlots = b.slots;

    if (aSlots > bSlots) {return -1;}
    if (bSlots > aSlots) {return 1;}
    
    const lcNameA = a.name.toLowerCase();
    const lcNameB = b.name.toLowerCase();

    if (lcNameA < lcNameB) {return -1;}
    if (lcNameB < lcNameA) {return 1;}

    return 0;
    
  }

  _countTotalCurrency(currencyItems) {
    
    return currencyItems.reduce(function (sum, item) {
      return sum
    })
  }

  _onRollAbilityTest(event) {
    event.preventDefault();
    let abilityName = event.currentTarget.dataset.ability;
    let targetValue = event.currentTarget.nextElementSibling.value
    console.log(abilityName + " test with target: " + targetValue);
  }
 
  _onRollSaveTest(event) {
    event.preventDefault();
    let save = event.currentTarget.dataset.save;
    let targetValue = event.currentTarget.nextElementSibling.value
    console.log("Making a " + save + " Saving Throw with target: " + targetValue);
  }
  
  _onChangeAbilityScore(event) {
    let abilityName = event.currentTarget.dataset.ability;
    let abilityValue = event.currentTarget.value
    console.log(abilityName + " has the new value: " + abilityValue);
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
}