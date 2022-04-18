import { LOSER } from "../../../config.js";
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

    //cache all of this data in the charsheet object for easy reference in code below
    this.dataCache = data;

    //note the character's class and level for use elsewhere
    let className = data.data.class.name.value;
    data.data.className = className;
    className = this._normalizeClassName(className);
    const classLevel = data.data.class.level.value;

    //note the items carried by the character for use elsewhere
    let allItems = data.actor.items;
    

    // prep the info actually going to the template
    // Note the use of data.data here. Data.data is sent to the template, where it is de-referenced
    // as just 'data' to access what is stored here

    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(allItems)

    //total slots carried by a character - note that a character can't carry logistical items
    data.data.totalSlots = inventory.armor.slots + inventory.currency.slots + inventory.equipment.slots + 
    inventory.loot.slots +inventory.weapon.slots;
    data.data.inventory = inventory;

    //warn on excessive slots used
    this._warnOnExcessiveSlotsUsed();

    //calculate movement based on slot encumberence
    const moveRates = this._calculateMovement();
    data.data.moveTactical = moveRates[0];
    data.data.moveOverland = moveRates[1];

    //total amount of currency carried by character
    data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //note if this character is a spellcaster
    const isSpellcaster = this._isSpellcaster(className);
    data.data.isSpellcaster = isSpellcaster;
  

    //build this character'spellbook - note spells are just Items, handled similarly to Inventory
    if(data.data.isSpellcaster) {
      const spellbook = this._buildSpellbook(className, classLevel, allItems);
      data.data.spellbook = spellbook;
    }

    //build this character's feature list - features are just Items, handled like Inventory
    data.data.features = this._buildFeatures(allItems);

    //add the LOSER config to make building select boxes easy
    data.data.config = CONFIG.LOSER;

    //set some specifics based on character class
    data.data.vision = this._getVision(className);
    data.data.alignment = this._getAlignment(className);
    data.data.size = this._getSize(className);
    data.data.bab = this._getBab(className, classLevel);

    //set ability score text
    let rawTxt = CONFIG.LOSER.Abilities.phys[data.data["ability-scores"].phys.value];
    data.data.physText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.dex[data.data["ability-scores"].dex.value];
    data.data.dexText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.comp[data.data["ability-scores"].comp.value];
    data.data.compText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.cha[data.data["ability-scores"].cha.value];
    data.data.chaText = this._parseAbilityText(rawTxt);

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
    
    //Inventory - Item Edit & Delete icons
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    //Spells - mem and de-mem icons, cast spells
    html.find(".spell-mem").click(this._onSpellMemorize.bind(this));
    html.find(".spell-demem").click(this._onSpellDememorize.bind(this));
    html.find(".cast-spell-bind").click(this._onSpellCast.bind(this));
    html.find(".uncast-spell-bind").click(this._onSpellUncast.bind(this));

    //Features - show feature
    html.find(".show-feature-bind").click(this._onShowFeature.bind(this));
    
    //establish default listeners
    super.activateListeners(html);
  }

  //hanlder when an item is dropped on this sheet
   //@Override <Unknown - undocumented API?>
   async _onDropItemCreate(itemData) {

    //check dragged item type and conditionally reject it
    let validType = true;
    let msg = "";
    switch(itemData.type) {

      case "armor":
        validType = this._hasPhysForArmorType(itemData.data.properties);
        msg = "Insufficient PHYS to carry this item"
        break;

      case "logistic":
        validType = false; //logistics are never allowed on characters
        msg = "This type not allowed on Characters";
        break;
      
      case "spell":
        if(!this.dataCache.data.isSpellcaster) {
          validType = false;
          msg = "This character is not a spellcaster";
        } else {
          validType = this._usesSpellList(itemData.data.spellList);
          msg = "This spell is from the wrong spell list";
        }
        break;
    }

    if(!validType) {
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //default to the handler to create the embedded document
    super._onDropItemCreate(itemData);
   }

  /* -------------------------------------------------------------
   Features (Inventory) Methods
  ----------------------------------------------------------------*/
  _buildFeatures(allItems) {
    const allFeatures = {
      "class": {"features": []},
      "language": {"features": []},
      "other": {"features": []},
    };

    //coallate features by category
    allItems.map(item => {

      if(item.type === "feature") {
        allFeatures[item.data.category].features.push(item);
      }

    });

    //sort features
    allFeatures.class.features.sort();
    allFeatures.language.features.sort();
    allFeatures.other.features.sort();

    return allFeatures;
  }

  _featureSorter(a,b) {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName > bName) {return 1;}
    if (bName > aName) {return -1;}

    return 0;
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
      "1": {"level": 1, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[0], "spells":[]},
      "2": {"level": 2, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[1], "spells":[]},
      "3": {"level": 3, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[2], "spells":[]},
      "4": {"level": 4, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[3], "spells":[]},
      "5": {"level": 5, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[4], "spells":[]},
      "6": {"level": 6, "memorized": 0, "cast": 0, "remaining": 0, "maxUses": spellsPerLevel[5], "spells":[]}       
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
    for(let i=1; i<=6; i++){
      spellbook[i].remaining = spellbook[i].maxUses - spellbook[i].cast;
    }

    //sort the spells
    spellbook[1].spells.sort(this._spellSorter);
    spellbook[2].spells.sort(this._spellSorter);
    spellbook[3].spells.sort(this._spellSorter);
    spellbook[4].spells.sort(this._spellSorter);
    spellbook[5].spells.sort(this._spellSorter);
    spellbook[6].spells.sort(this._spellSorter);

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
          item.slots = Utils.calcSlots(item, this.dataCache.data.className);
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

    //determine if we even cast the spell
    let spellWasCast = false;
    if(this.dataCache.data.spellbook.mustMemorize) {
      if(item.data.data.timesMemorized > 0 && remaining > 0) {
        item.update({"data.timesMemorized": item.data.data.timesMemorized - 1});
        spellWasCast = true;
      }
    } else {
      if(remaining > 0) {
        spellWasCast = true;
      }
    }

    //bookkeeping on spell being cast
    if(spellWasCast) {
      item.update({"data.timesCast": item.data.data.timesCast + 1});
      this.dataCache.data.spellbook[level].cast += 1;
      this.dataCache.data.spellbook[level].remaining = this.dataCache.data.spellbook[level].maxUses - this.dataCache.data.spellbook[level].cast;
      
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
      if(this.dataCache.data.spellbook.mustMemorize) {
        item.update({"data.timesMemorized": item.data.data.timesMemorized + 1});
      }
      item.update({"data.timesCast": item.data.data.timesCast - 1});
      this.dataCache.data.spellbook[level].cast -= 1;
      this.dataCache.data.spellbook[level].remaining = maxUses - this.dataCache.data.spellbook[level].cast;

      this.lastSpellCastId = null;

      this.displayChatMessageForSpellcasting(item, true);
    }
  }

  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/

  //true if class is a spellcasting class
  _isSpellcaster(className) {
    if (this._noClassDefined(className)) {
      return false;
    }
    return CONFIG.LOSER.ClassDetails[className].isSpellcaster;
  }

  //returns max spells allowed to be used at given level
  _maxSpellsForSpellLevel(level) {
    return this.dataCache.data.spellbook[level].maxUses;
  }

  //returns the count of spells used at given level
  _spellsMemorizedForSpellLevel(level) {
    return this.dataCache.data.spellbook[level].memorized;
  }

  //returns the count of spells remaining at given level
  _spellsRemainingForSpellLevel(level) {
    return this.dataCache.data.spellbook[level].remaining;
  }

  //looks up spells available based on class and level
  _getSpellCountForClassAndLevel(className, level) {
    const stringLevel = level.toString();
    const casterData = CONFIG.LOSER.Spellcasters[className];
    return casterData.table[stringLevel];
  }

  _getVision(className) {
    if (this._noClassDefined(className)) {
      return "Normal";
    }
    return CONFIG.LOSER.ClassDetails[className].vision;
  }

  _getAlignment(className) {
    if (this._noClassDefined(className)) {
      return "Neutral";
    }
    return CONFIG.LOSER.ClassDetails[className].alignment;
  }

  _getSize(className) {
    if (this._noClassDefined(className)) {
      return "Medium";
    }
    return CONFIG.LOSER.ClassDetails[className].size;
  }

  //true of no specific class selected
  _noClassDefined(className) {
    if (className === undefined || className === "") {
      return true;
    }
    return false;
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

  //parses ability score text into a useful output
  _parseAbilityText(rawText) {
    return rawText.split("|");
  }

  //returns base attack bonus based on class/level
  _getBab(className, level) {

    //no class, normal human and level 0 always have bab 0
    const stringLevel = level.toString();
    if (className === undefined || className === "" || 
    className === "normal-human" || stringLevel === "0") {
      return "+0";
    }

    return CONFIG.LOSER.ClassBaB[className][stringLevel];
  }

  //returns true if this character uses the supplied spell list
  _usesSpellList(spellList) {
    if(!this.dataCache.data.isSpellcaster) {
      return false;
    }

    const actualList = CONFIG.LOSER.Spellcasters[this.dataCache.data.className].spellList;
    return spellList === actualList;
  }

  //returns true if this character has high enough PHYS to carry the armor
  _hasPhysForArmorType(armorProps) {
    const phys = this.dataCache.data["ability-scores"].phys.value;
    const isShield = armorProps[0];

    //quick exit
    if(phys >= 9 || isShield) {
      return true;
    }

    //check the details
    const isLight = armorProps[1];
    const isMedium = armorProps[2];
    const isHeavy = armorProps[3];

    if(isLight && phys >= 4) {
      return true
    }
    if (isMedium && phys >= 6) {
      return true;
    }
    if (isHeavy && phys >= 9) {
      return true;
    }

    return false;
  }

  //calculates movement rates based on all factors
  _calculateMovement() {
    let moveRates = [];

    const totalSlots = this.dataCache.data.totalSlots;
    let breakPoint1 = 9;
    let breakPoint2 = 10;
    let breakPoint3 = 15;

    //fighter gets 2 extra slots in each catagory
    if(this.dataCache.data.className === "fighter") {
      breakPoint1 +=2;
      breakPoint2 +=2;
      breakPoint3 +=2;
    }
    
    let tactical = 0;
    let overland = 0;
    if(totalSlots <= breakPoint1) {
      tactical = 40;
      overland = 25;
    } else if(totalSlots == breakPoint2) {
      tactical = 30;
      overland = 20;
    } else if(totalSlots <= breakPoint3) {
      tactical = 20;
      overland = 15;
    } else {
      tactical = 10;
      overland = 10;
    }

    //fighter gets a move bump
    if(this.dataCache.data.className === "fighter") {
      tactical += 5;
    }
    
    moveRates = [tactical,overland];
    return moveRates;
  }

  //prints a warning and chatlog message if character is overloaded
  _warnOnExcessiveSlotsUsed() {
    const totalSlots = this.dataCache.data.totalSlots;
    const className = this.dataCache.data.className;

    let needsWarning = false;
    let msg = "";

    if(className === "fighter" && totalSlots > 27) {
      needsWarning = true;
      msg = "Exceeded maximum allowed slots for a fighter (27)"
    } else if(className === "heflin" && totalSlots > 12) {
      needsWarning = true;
      msg = "Exceeded maximum allowed slots for a heflin (12)";
    } else if(totalSlots > 25) {
      needsWarning = true;
      msg = "Exceeded maximum allowed slots for any character (25)";
    }

    if(needsWarning) {
      ui.notifications.warn(`${msg}`);
      this.displayGeneralChatMessage(msg);
    }

  }
}