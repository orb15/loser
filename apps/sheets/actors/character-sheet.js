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
    
    //load the dataCache, which will be the context object from the base class, accessible via this.dataCache after
    //the call below this comment
    super.getData()

    //note the character's class if that class is a Spellcaster
    let rawClassName = this.dataCache.system.class.name.value;
    if(this._noClassDefined(rawClassName)) {
      rawClassName = "normal human"
    }
    const sysClassName = this._toSysClassName(rawClassName);
    const isSpellcaster = this._isSpellcaster(sysClassName);

    //note level for use in various calcs
    const classLevel = this.dataCache.system.class.level.value;

    //set some specifics based on character class and level
    const vision = this._getVision(sysClassName);
    const alignment = this._getAlignment(sysClassName);
    const size = this._getSize(sysClassName);
    const bab = this._getBab(sysClassName, classLevel);

    //note the items carried by the character for use elsewhere
    let allItems = this.dataCache.source.items;

    //build this character's feature list - features are just Items, handled like Inventory
    const features = this._buildFeatures(allItems);
    
    //prep the inventory - divide by catagory and sort appropriately
    const inventory = this._prepareInventory(allItems)

    //total weight carried by a character
    const totalWeightCarried = inventory.armor.weight + inventory.currency.weight + inventory.equipment.weight + 
    inventory.loot.weight + inventory.weapon.weight;

    //unencumbered limit, encumbered limit
    const physScore =this.dataCache.system["ability-scores"].phys.value
    const unencumberedLimit = CONFIG.LOSER.ClassDetails[sysClassName].baseCarry + (CONFIG.LOSER.WeightChangePerPhysMod * CONFIG.LOSER.PhysBonus[physScore]);
    const encumberedLimit = unencumberedLimit * 2;
    if(encumberedLimit <= 0) {
      encumberedLimit = 30;
    }

    //tooltip for encumbrance limits
    const encumbranceTooltip = "Unencumbered up to: " + unencumberedLimit + " Max Carry: " + encumberedLimit + " lbs";

    //total amount of currency carried by character
    const totalCurrency = this._countTotalCurrency(inventory.currency.items);

    //build spellbook
    let spellbook = null;
    if(isSpellcaster) {
      spellbook = this._buildSpellbook(sysClassName, classLevel, allItems);
    }

  //set ability score text
    let rawTxt = CONFIG.LOSER.Abilities.phys[this.dataCache.system["ability-scores"].phys.value];
    const physText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.dex[this.dataCache.system["ability-scores"].dex.value];
    const dexText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.comp[this.dataCache.system["ability-scores"].comp.value];
    const compText = this._parseAbilityText(rawTxt);
    rawTxt = CONFIG.LOSER.Abilities.cha[this.dataCache.system["ability-scores"].cha.value];
    const chaText = this._parseAbilityText(rawTxt);

    //add additional items to the dataCache
    foundry.utils.mergeObject(this.dataCache, {
      rawClassName: rawClassName,
      sysClassName: sysClassName,
      isSpellcaster: isSpellcaster,
      vision: vision,
      alignment: alignment,
      size: size,
      bab: bab,
      features: features,
      inventory: inventory,
      totalWeightCarried: totalWeightCarried,
      unencumberedLimit: unencumberedLimit,
      encumberedLimit: encumberedLimit,
      encumbranceTooltip: encumbranceTooltip,
      totalCurrency: totalCurrency,
      spellbook: spellbook,
      physText: physText,
      dexText: dexText,
      compText: compText,
      chaText: chaText
    });

    //use info in context to calculate movement
    this._calculateMovement();
        
    //return the dataCache, which is an context object enhanced by the calcs in this method and potentially elsewhere
    return this.dataCache;
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

    //Button Town
    html.find(".event-recover-spells").click(this._onRecoverSpells.bind(this));

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
        validType = false; //logistics are never allowed on characters
        msg = "This type not allowed on Characters";
        break;

      case "spell":
        if(!this.dataCache.isSpellcaster) {
          validType = false;
          msg = "This character is not a spellcaster";
        } else {
          validType = this._usesSpellList(item.system.spellList);
          msg = "This spell is from the wrong spell list";
        }
        break;
    }

    //prevent character from adding an invalid type of item
    if(!validType) {
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //prevent the character from going over the weight limit
    const itemWeight = item.system.weight;
    if (itemWeight + this.dataCache.totalWeightCarried > this.dataCache.encumberedLimit) {
      msg = "This item would exceed the character's max carry limit";
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //friendly reminder that the character is Encumbered but not yet at limit
    if (itemWeight + this.dataCache.totalWeightCarried > this.dataCache.unencumberedLimit) {
      ui.notifications.warn(`Carrying this item will make the character Encumbered!`);
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
        let cat = item.system.category;
        if (cat === "monster") {
          cat = "other";
        }
        allFeatures[cat].features.push(item);
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
        item.system.mustMemorize = spellbook.mustMemorize;
        spellbook[item.system.level].spells.push(item);
        spellbook[item.system.level].memorized += item.system.timesMemorized;
        spellbook[item.system.level].cast += item.system.timesCast;
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
    const level = item.system.level
    const remaining = this._spellsRemainingForSpellLevel(level);
    const memorized = this._spellsMemorizedForSpellLevel(level);
    if(item.system.timesMemorized < CONFIG.LOSER.MaxSpellMemorizeCount &&
      memorized < remaining) {
      item.update({"system.timesMemorized": item.system.timesMemorized + 1});
    }

  }

  _onSpellDememorize(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    if(item.system.timesMemorized > 0) {
     item.update({"system.timesMemorized": item.system.timesMemorized - 1});
    }
  }

  _onSpellCast(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const level = item.system.level
    const remaining = this._spellsRemainingForSpellLevel(level);

    //determine if we even cast the spell
    let spellWasCast = false;
    if(this.dataCache.spellbook.mustMemorize) {
      if(item.system.timesMemorized > 0 && remaining > 0) {
        item.update({"system.timesMemorized": item.system.timesMemorized - 1});
        spellWasCast = true;
      }
    } else {
      if(remaining > 0) {
        spellWasCast = true;
      }
    }

    //bookkeeping on spell being cast
    if(spellWasCast) {
      item.update({"system.timesCast": item.system.timesCast + 1});
      this.dataCache.spellbook[level].cast += 1;
      this.dataCache.spellbook[level].remaining = this.dataCache.spellbook[level].maxUses - this.dataCache.spellbook[level].cast;
      
      //note last spell cast - prevent uncasting wrong spell
      this.lastSpellCastId = item.id;

      this.displayChatMessageForSpellcasting(item, false, event.ctrlKey);
    }
  }

  _onSpellUncast(event) {
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    const level = item.system.level
    const remaining = this._spellsRemainingForSpellLevel(level);
    const maxUses = this._maxSpellsForSpellLevel(level);
    const uncastSpellId = item.id;

    //prevent uncasting wrong spell
    if(uncastSpellId != this.lastSpellCastId) {
      return;
    }

    //prevent cornercases like repeated uncasts
    if(remaining >= 0 && remaining < maxUses) {
      if(this.dataCache.spellbook.mustMemorize) {
        item.update({"system.timesMemorized": item.system.timesMemorized + 1});
      }
      item.update({"system.timesCast": item.system.timesCast - 1});
      this.dataCache.spellbook[level].cast -= 1;
      this.dataCache.spellbook[level].remaining = maxUses - this.dataCache.spellbook[level].cast;

      //note that we just uncast a spell - no spell has been cast (this is set in _onSpellCast)
      this.lastSpellCastId = null;

      this.displayChatMessageForSpellcasting(item, true);
    }
  }

  _onResourceDieClick(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);

    const resourceDieValue = item.system.resourceDie;
    const itemName = item.name;

    //safety
    if(resourceDieValue === undefined || resourceDieValue === "N/A") {
      return;
    }

    //inform the room on attempted empty resource use - naughty player :)
    if(resourceDieValue === "0") {
      const msg = "Item: " + itemName + " has 0 Resource Die uses available and should not have been used!"
      ui.notifications.warn(`${msg}`); 
      this.displayGeneralChatMessage(msg);
      return;
    }

    return this._makResourceDieTest(itemName, item, resourceDieValue);
  }

  _onRecoverSpells(event) {
    event.preventDefault();

    //safety
    if(!this.dataCache.isSpellcaster) {
      return;
    }

    const spellbook = this.dataCache.spellbook;

    spellbook["1"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })
    spellbook["2"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })
    spellbook["3"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })
    spellbook["4"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })
    spellbook["5"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })
    spellbook["6"].spells.map(spell => {
      const item = this.actor.items.get(spell._id);
      item.update({"system.timesMemorized": 0});
      item.update({"system.timesCast": 0});
    })

    this.displayGeneralChatMessage("Recovering Spells");
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
    return this.dataCache.spellbook[level].maxUses;
  }

  //returns the count of spells used at given level
  _spellsMemorizedForSpellLevel(level) {
    return this.dataCache.spellbook[level].memorized;
  }

  //returns the count of spells remaining at given level
  _spellsRemainingForSpellLevel(level) {
    return this.dataCache.spellbook[level].remaining;
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
  _toSysClassName(className) {

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
    if(!this.dataCache.isSpellcaster) {
      return false;
    }

    const actualList = CONFIG.LOSER.Spellcasters[this.dataCache.sysClassName].spellList;
    return spellList === actualList;
  }

  //calculates movement rates based on all factors
  _calculateMovement() {
    const totalWeightCarried = this.dataCache.totalWeightCarried;
    const className = this.dataCache.sysClassName;
    const baseTactical = CONFIG.LOSER.ClassDetails[className].baseTactical;
    const baseOverland = CONFIG.LOSER.ClassDetails[className].baseOverland;

    let tactical = 0;
    let overland = 0;

    if(totalWeightCarried <= this.dataCache.unencumberedLimit) {
      tactical = baseTactical;
      overland = baseOverland;
    } else if (totalWeightCarried <= this.dataCache.encumberedLimit){

      //cut available move in half
      tactical = Utils.calcHalfTacticalMovement(baseTactical)
      overland = Math.floor(baseOverland / 2);
    }

    //fighter gets a move bump
    if(className === "fighter" && tactical > 0) {
      tactical += 5;
    }

    this.dataCache.moveTactical = tactical;
    this.dataCache.moveOverland = overland;
  }

  //performs a Resource Die test
  async _makResourceDieTest(itemName, item, currentDieSize) {

    //if the resource is fully consumed, skip
    if (currentDieSize <= 0) {
      return
    }
    
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

    const titleText = item.actor.name + ": " + "Resource Test for " + itemName;

    //prep the template data and render the template
    const chatTemplateData = {
      titleText: titleText,
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
    item.update({"system.resourceDie": newDieSize});

    return r;
  }

}

