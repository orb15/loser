import Utils from "../../utils.js"
import LoserActorSheetBase from "./base-sheet.js";

// This class provides core functionality for the Character and NPC
// Character Sheets
export default class LoserCharacterSheet extends LoserActorSheetBase {
  
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

    //note the character's class and level for use elsewhere
    let className = data.data.class.name.value;
    className = this._normalizeClassName(className);
    const classLevel = data.data.class.level.value;

    //note the items carried by the character for use elsewhere
    let allItems = data.actor.items;
    
    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(allItems)


    // prep the info actually going to the template
    // Note the use of data.data here. Data.data is sent to the template, where it is de-referenced
    // as just 'data' to access what is stored here

    //total slots carried by a character - note that a character can't carry logistical items
    data.data.totalSlots = inventory.armor.slots + inventory.currency.slots + inventory.equipment.slots + 
      inventory.loot.slots +inventory.weapon.slots;

    data.data.inventory = inventory;

    data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //note if this character is a spellcaster
    data.data.isSpellcaster =this._isSpellcaster(className);

    //build this character'spellbook - note spells are just Items, handled similarly to Inventory
    if(data.data.isSpellcaster) {
      const spellbook = this._buildSpellbook(className, classLevel, allItems);
      data.data.spellbook = spellbook;
      this.spellbook = spellbook;
    }

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

    //Spells - mem and de-mem icons, cast spells
    html.find(".spell-mem").click(this._onSpellMemorize.bind(this));
    html.find(".spell-demem").click(this._onSpellDememorize.bind(this));
    html.find(".cast-spell-bind").click(this._onSpellCast.bind(this));
    html.find(".uncast-spell-bind").click(this._onSpellUncast.bind(this));


    //establish default listeners
    super.activateListeners(html);
  }

   //@Override <Unknown - undocumented API?>
   async _onDropItemCreate(itemData) {

    let validType = true;
    switch(itemData.type) {
      case "logistic":
        validType = false; //logistics are never allowed on characters
        break;
      
      case "spell":
        if(!this.isSpellcaster) {
          validType = false;
        }
    }
    
    if(!validType) {
      return ui.notifications.warn("This character cannot carry items of type: " + itemData.type);
    }

     super._onDropItemCreate(itemData);
   }

  /* -------------------------------------------------------------
   Spellbook (Inventory) Methods
  ----------------------------------------------------------------*/

  //builds a spellbook for use in the template
  _buildSpellbook(className, level, allItems) {

    const spellsPerLevel = this._getSpellCountForClassAndLevel(className, level);

    const spellbook = {
      "list": CONFIG.LOSER.Spellcasters[className].spellList,
      "mustMemorize":  CONFIG.LOSER.Spellcasters[className].memorizes,
      "0": {"level": 1, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[0], "spells":[]},
      "1": {"level": 2, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[1], "spells":[]},
      "2": {"level": 3, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[2], "spells":[]},
      "3": {"level": 4, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[3], "spells":[]},
      "4": {"level": 5, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[4], "spells":[]},
      "5": {"level": 6, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[5], "spells":[]}       
    };

    //push spells into their proper level, sum up times spells of this level have been memorized/used
    allItems.map(item => {

      if(item.type === "spell") {
        item.data.mustMemorize = spellbook.mustMemorize;
        spellbook[item.data.level].spells.push(item);
        spellbook[item.data.level].memorized += item.data.timesMemorized;
        spellbook[item.data.level].cast += item.data.timesCast;
      }
    });

    //calc remaining spells each level
    for(let i=0; i<=5; i++){
      spellbook[i].remaining = spellbook[i].maxUses - spellbook[i].cast;
    }

    //sort the spells
    spellbook[0].spells.sort(this._spellSorter);
    spellbook[1].spells.sort(this._spellSorter);
    spellbook[2].spells.sort(this._spellSorter);
    spellbook[3].spells.sort(this._spellSorter);
    spellbook[4].spells.sort(this._spellSorter);
    spellbook[5].spells.sort(this._spellSorter);

    return spellbook;
  }

  //sort spells by name
  _spellSorter(a,b) {

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName > bName) {return 1;}
    if (bName > aName) {return -1;}

    return 0;
  }

  /* -------------------------------------------------------------
   Inventory Methods
  ----------------------------------------------------------------*/

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
    };

    allItems.map(item => {

      switch(item.type) {
        case "weapon":
          inventory.weapon.items.push(item);
          item.slots = Utils.calcSlots(item);
          inventory.weapon.slots += item.slots;
          break;
        case "armor":
          inventory.armor.items.push(item);
          item.slots = Utils.calcSlots(item);
          inventory.armor.slots +=item.slots;
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
          item.slots = Utils.calcSlots(item);
          inventory.loot.slots += item.slots;
          break;
        case "currency":
          inventory.currency.items.push(item);
          item.slots = Utils.calcSlots(item);
          inventory.currency.slots += item.slots;
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
  
  //sort by slots then name
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

    if(currencyItems.length == 0) {
      return 0;
    } 
    
    let allItems =  currencyItems.reduce(function (sum, item) {
      let i = item.data;
      sum.data.coins.gp += i.coins.gp;
      sum.data.coins.sp += i.coins.sp;
      sum.data.coins.cp += i.coins.cp;

      sum.data.gems.sp10 += i.gems.sp10;
      sum.data.gems.sp25 += i.gems.sp25;
      sum.data.gems.sp50 += i.gems.sp50;

      sum.data.gems.sp100 += i.gems.sp100;
      sum.data.gems.sp250 += i.gems.sp250;
      sum.data.gems.sp500 += i.gems.sp500;

      sum.data.gems.sp1000 += i.gems.sp1000;
      sum.data.gems.sp2500 += i.gems.sp2500;
      sum.data.gems.sp5000 += i.gems.sp5000;

      return sum;
    })

    let total = (allItems.data.coins.gp * 10) + (allItems.data.coins.sp) + (allItems.data.coins.cp / 10);
    total += (allItems.data.gems.sp10 * 10) + (allItems.data.gems.sp25 * 25) + (allItems.data.gems.sp50 * 50);
    total += (allItems.data.gems.sp100 * 100) + (allItems.data.gems.sp250 * 250) + (allItems.data.gems.sp50 * 500);
    total += (allItems.data.gems.sp1000 * 1000) + (allItems.data.gems.sp2500 * 2500) + (allItems.data.gems.sp500 * 5000);
    
    return total;
  }

  /* -------------------------------------------------------------
    Event Handlers
  ----------------------------------------------------------------*/
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

  _onSpellMemorize(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const maxUses = this._maxSpellsForSpellLevel(item.data.data.level);
    const memorized = this._spellsMemorizedForSpellLevel(item.data.data.level);
    if(item.data.data.timesMemorized < CONFIG.LOSER.MaxSpellMemorizeCount &&
      memorized < maxUses) {
      item.update({"data.timesMemorized": item.data.data.timesMemorized + 1});
    }

  }

  _onSpellDememorize(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    if(item.data.data.timesMemorized > 0) {
     item.update({"data.timesMemorized": item.data.data.timesMemorized - 1});
    }
  }

  _onSpellCast(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const level = item.data.data.level
    const remaining = this._spellsRemainingForSpellLevel(level);

    if(remaining > 0) {
      if(this.spellbook.mustMemorize) {
        item.update({"data.timesMemorized": item.data.data.timesMemorized - 1});
      }
      item.update({"data.timesCast": item.data.data.timesCast + 1});
      this.spellbook[level].remaining = this.spellbook[level].maxUses - this.spellbook[level].cast;

      //note last spell cast - prevent uncasting wrong spell
      this.lastSpellCastId = item.id;

      this.displayChatMessageForSpellcasting(item, false, event.ctrlKey);
    }
  }

  _onSpellUncast(event) {
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const level = item.data.data.level
    const remaining = this._spellsRemainingForSpellLevel(level);
    const maxUses = this._maxSpellsForSpellLevel(level);
    const uncastSpellId = item.id;

    //prevent uncasting wrong spell
    if(uncastSpellId != this.lastSpellCastId) {
      return;
    }

    if(remaining >= 0 && remaining < maxUses) {
      if(this.spellbook.mustMemorize) {
        item.update({"data.timesMemorized": item.data.data.timesMemorized + 1});
      }
      item.update({"data.timesCast": item.data.data.timesCast - 1});
      this.spellbook[level].remaining = maxUses - this.spellbook[level].cast;

      this.lastSpellCastId = null;

      this.displayChatMessageForSpellcasting(item, true);
    }
  }


  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/

  //true if class is a spellcasting class
  _isSpellcaster(className) {
    return CONFIG.LOSER.Classes[className].isSpellcaster;
  }

  //returns max spells allowed to be used at given level
  _maxSpellsForSpellLevel(level) {
    return this.spellbook[level].maxUses;
  }

  //returns the count of spells used at given level
  _spellsMemorizedForSpellLevel(level) {
    return this.spellbook[level].memorized;
  }

  //returns the count of spells remaining at given level
  _spellsRemainingForSpellLevel(level) {
    return this.spellbook[level].remaining;
  }

  //looks up spells available based on class and level
  _getSpellCountForClassAndLevel(className, level) {
    const stringLevel = level.toString();
    const casterData = CONFIG.LOSER.Spellcasters[className];
    return casterData.table[stringLevel];
  }

  //standardizes class name
  _normalizeClassName(className) {

    className = className.toLowerCase();

    switch(className) {
      case "beast master":
        className = "beast-master";
        break;
      case "normal human":
        className = "normal-human";
        break;        
    }

    return className
  }
}