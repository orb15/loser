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

    //note the character's class and level for use elsewhere
    let className = data.data.class.name.value;
    data.data.className = className;
    className = this._normalizeClassName(className);
    const classLevel = data.data.class.level.value;
    const isSpellcaster = this._isSpellcaster(className);
    data.data.isSpellcaster = isSpellcaster;

    //note the items carried by the character for use elsewhere
    let allItems = data.actor.items;
    
    //build this character's feature list - features are just Items, handled like Inventory
    data.data.features = this._buildFeatures(allItems);

    //set some specifics based on character class
    data.data.vision = this._getVision(className);
    data.data.alignment = this._getAlignment(className);
    data.data.size = this._getSize(className);
    data.data.bab = this._getBab(className, classLevel);

    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(allItems)

    //total slots carried by a character
    data.data.totalSlots = inventory.armor.slots + inventory.currency.slots + inventory.equipment.slots + 
    inventory.loot.slots + inventory.weapon.slots + inventory.logistics.slots;
    data.data.inventory = inventory;

    //warn on excessive slots used
    this._warnOnExcessiveSlotsUsed();

    //total amount of currency carried by character
    data.data.totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //build spellbook
    if(isSpellcaster) {
      data.data.spellbook = this._buildSpellbook(className, classLevel, allItems);
    }

    //calculate movement
    const moveData = this._calculateMovement();
    data.data.moveTactical = moveData[0];
    data.data.moveOverland = moveData[1];

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
    
    //Ability Checks
    html.find(".event-ability-name").click(this._onRollAbilityTest.bind(this));

    //Ability Scores
    html.find(".event-ability-value").change(this._onAbilityValueChange.bind(this));

    //Inventory Resource Die
    html.find(".event-resourcedie-value").click(this._onResourceDieClick.bind(this));
    
    //Features
    html.find(".event-feature-img").click(this._onShowItem.bind(this));
  
    //Spells - mem and de-mem icons, cast spells
    html.find(".event-spell-mem").click(this._onSpellMemorize.bind(this));
    html.find(".event-spell-demem").click(this._onSpellDememorize.bind(this));
    html.find(".event-spell-img").click(this._onSpellCast.bind(this));
    html.find(".event-uncast-spell").click(this._onSpellUncast.bind(this));

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

      case "armor":
        validType = this._hasPhysForArmorType(item.data.properties);
        msg = "Insufficient PHYS to carry this item"
        break;

      case "logistic":
        validType = false; //logistics are never allowed on characters
        msg = "This type not allowed on Characters";
        break;

      case "feature":
        if(item.data.category === undefined || item.data.category === "") {
          validType = false; //invalid item setup!
          msg = "This feature is missing a category";
        }

        break;
      
      case "spell":
        if(!this.dataCache.data.isSpellcaster) {
          validType = false;
          msg = "This character is not a spellcaster";
        } else {
          validType = this._usesSpellList(item.data.spellList);
          msg = "This spell is from the wrong spell list";
        }
        break;
    }

    if(!validType) {
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //default to the handler to create the embedded document
    super._onDropItemCreate(item);
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
    Event Handlers
  ----------------------------------------------------------------*/
  
 _onRollAbilityTest(event) {
    event.preventDefault();
    let abilityName = event.currentTarget.dataset.ability;
    let targetValue = event.currentTarget.nextElementSibling.value
    return this._makeD20Test(abilityName, targetValue, true);
  }

  _onAbilityValueChange(event) {
    event.preventDefault();
    let proposedValue = event.currentTarget.value;
    if(proposedValue > 18) {
      event.currentTarget.value = 18;
      return;
    } else if(proposedValue < 3) {
      event.currentTarget.value = 3;
      return;
    }
    event.currentTarget.value = proposedValue;
  }

  _onSpellMemorize(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const level = item.data.data.level
    const remaining = this._spellsRemainingForSpellLevel(level);
    const memorized = this._spellsMemorizedForSpellLevel(item.data.data.level);
    if(item.data.data.timesMemorized < CONFIG.LOSER.MaxSpellMemorizeCount &&
      memorized < remaining) {
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

  _onResourceDieClick(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);

    const resourceDieValue = item.data.data.resourceDie;
    const itemName = item.name;

    //safety
    if(resourceDieValue === undefined || resourceDieValue === "N/A") {
      return;
    }

    //inform the room on empty resource use - naughty player :)
    if(resourceDieValue === "0") {
      const msg = "Item: " + itemName + " has 0 Resource Die uses available and should not have been used!"
      ui.notifications.warn(`${msg}`); 
      this.displayGeneralChatMessage(msg);
      return;
    }

    return this._makResourceDieTest(itemName, item, resourceDieValue);
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

  //performs a Resource Die test
  async _makResourceDieTest(itemName, item, currentDieSize) {
    
    const dieFormula = "1d" + currentDieSize;
    let r = new Roll(dieFormula);

    // Execute the roll
    await r.evaluate({async: true});

    //determine outcome
    let isStable = true;
    let isExpended = false;
    let newDieSize = currentDieSize;
    if(r.total <= 2) {
      isStable = false;
      switch(currentDieSize){
        case "4":
          newDieSize = "0";
          isExpended = true;
          break;
        case "6":
          newDieSize = "4";
          break;
        case "8":
          newDieSize = "6";
          break;
        case "10":
          newDieSize = "8";
          break;
        case "12":
          newDieSize = "10";
          break;
      }
    }

    //prep the template data and render the template
    const chatTemplateData = {
      titleText: "Resource Test for " + itemName,
      dieResult: r.total,
      isStable: isStable,
      isExpended: isExpended,
      newDieSize: newDieSize
    }
    const html = await renderTemplate("systems/loser/templates/chat/resource-die.html", chatTemplateData);

    const chatData = {
      type:  CONST.CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: html};

    //post the message (also show die roll)
    await r.toMessage(chatData);
    
    //note the change if any
    item.update({"data.resourceDie": newDieSize});

    return r;
  }
}