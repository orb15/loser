import Utils from "../../utils.js"

// This class provides base functionality for all Actor sheets
export default class LoserActorSheetBase extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  /* -------------------------------------------------------------
    Overrides and Core Methods
  ----------------------------------------------------------------*/

  //Configure some defaults specific to all sheets
  //@override ActorSheet
  static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["loser", "sheet", "actor"],
      width: 720,
      height: 680,
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "core"}]
    });
  }

  //Returns data to the template (character sheet HTML and CSS) for rendering
  //@Override Application
  getData(options) {

    //get base data for item and load it into a 'context' - a construct for holding all
    //needed info for the template
    const context = super.getData(options);

    //obtain the base actor (for access to anything  on the actor object)
    const actor = context.actor;

    //add the LOSER config to make building select boxes easy
    const config = CONFIG.LOSER;

    //add additional items to the context
    foundry.utils.mergeObject(context, {
      system: actor.system, //this is the data from the template!
      source: actor,
      config: config,
    });

    //use info in context to define some booleans useful for templating
    this._setTemplateBooleans(context)

    //add the entire context as base data so subclasses can use and extend it during rules processing and template prep
    this.dataCache = context;

    //this object will be passed to the template for handlebars rendering. Note that the handlesbars reference
    //is to the _properties_ of context, not context iteself
    return context;
  }

  //Establish listeners for events on the character sheet
  //@Override Application
  activateListeners(html) {
    
    //Saving Throws
    html.find(".event-saves-name").click(this._onRollSaveTest.bind(this));

    //Saving Throw Values
    html.find(".event-save-value").change(this._onSaveValueChange.bind(this));

    //Inventory
    html.find(".event-item-edit").click(this._onItemEdit.bind(this));
    html.find(".event-item-delete").click(this._onItemDelete.bind(this));
    html.find(".event-inventory-img").click(this._onShowItem.bind(this));

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

      case "feature":
        if(item.system.category === undefined || item.system.category === "") {
          validType = false; //invalid item setup!
          msg = "This feature is missing a category";
        }
        break;
    }

    //prevent adding an invalid type of item
    if(!validType) {
      return ui.notifications.warn(`Cannot carry this item: ${msg}`);
    }

    //default to the handler to create the embedded document
    super._onDropItemCreate(item);
   }

  /* -------------------------------------------------------------
   Inventory Methods
  ----------------------------------------------------------------*/

  //organize inventory for display
  _prepareInventory(allItems) {

    //prepare an organized inventory
    const inventory = {
      "weapon": {"weight": 0,"items": [],"type": "weapon"},
      "armor": {"weight": 0,"items": [],"type": "armor"},
      "equipment": {"weight": 0,"items": [],"type": "equipment"},
      "loot": {"weight": 0,"items": [],"type": "loot"},
      "currency": {"weight": 0,"items": [],"type": "currency"},
      "logistics": {"weight": 0,"items": [],"type": "logistic"},
    };

    allItems.map(item => {

      switch(item.type) {
        case "weapon":
          inventory.weapon.items.push(item);
          item.weight = Utils.calcSlots(item);
          inventory.weapon.weight += item.weight;
          break;
        case "armor":
          inventory.armor.items.push(item);
          item.weight = Utils.calcSlots(item, this.dataCache.className);
          inventory.armor.weight +=item.weight;
          break;
        case "equipment":
          inventory.equipment.items.push(item);
          item.weight = Utils.calcSlots(item);
          inventory.equipment.weight += item.weight

          //note if this item has a resource die associated with it
          if (item.system.resourceDie >= 0) {
            item.hasResourceDie = true
          } else {
            item.hasResourceDie = false
          }

          break;
        case "loot":
          inventory.loot.items.push(item);
          item.weight = Utils.calcSlots(item);
          inventory.loot.weight += item.weight;
          break;
        case "currency":
          inventory.currency.items.push(item);
          item.weight = Utils.calcSlots(item);
          inventory.currency.weight += item.weight;
          break;
        case "logistic":
          inventory.logistics.items.push(item);
          item.weight = Utils.calcSlots(item);
          inventory.logistics.weight += item.weight;
          break;
      }
    })

    //sort the various arrays by weight used then by name
    inventory.weapon.items.sort(this._inventorySorter)
    inventory.armor.items.sort(this._inventorySorter)
    inventory.equipment.items.sort(this._inventorySorter)
    inventory.loot.items.sort(this._inventorySorter)
    inventory.currency.items.sort(this._inventorySorter)
    inventory.logistics.items.sort(this._inventorySorter)

    return inventory
  }
  
  //sort by weight then name
  _inventorySorter(a, b) {
    
    const aWeight = a.weight;
    const bWeight = b.weight;

    if (aWeight > bWeight) {return -1;}
    if (bWeight > aWeight) {return 1;}
    
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
    
    const allCurrencyItemsCounter =  currencyItems.reduce(function (sum, item) {
      let i = item.system;
      sum.coins.gp += i.coins.gp;
      sum.coins.sp += i.coins.sp;
      sum.coins.cp += i.coins.cp;

      sum.gems.sp10 += i.gems.sp10;
      sum.gems.sp25 += i.gems.sp25;
      sum.gems.sp50 += i.gems.sp50;

      sum.gems.sp100 += i.gems.sp100;
      sum.gems.sp250 += i.gems.sp250;
      sum.gems.sp500 += i.gems.sp500;

      sum.gems.sp1000 += i.gems.sp1000;
      sum.gems.sp2500 += i.gems.sp2500;
      sum.gems.sp5000 += i.gems.sp5000;

      return sum;
    })

    const aci = allCurrencyItemsCounter.system;

    let total = (aci.coins.gp * 10) + (aci.coins.sp) + (aci.coins.cp / 10);
    total += (aci.gems.sp10 * 10) + (aci.gems.sp25 * 25) + (aci.gems.sp50 * 50);
    total += (aci.gems.sp100 * 100) + (aci.gems.sp250 * 250) + (aci.gems.sp50 * 500);
    total += (aci.gems.sp1000 * 1000) + (aci.gems.sp2500 * 2500) + (aci.gems.sp5000 * 5000);
    
    return total;
  }

  /* -------------------------------------------------------------
    EventHandlers
  ----------------------------------------------------------------*/

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

  _onShowItem(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    
    const theName = item.name;
    let description = "";
    const image = item.img;
    let msgContent = "";

    if(event.ctrlKey) {
      description = item.system.description;
      msgContent = theName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;"><br>` + description;
    } else {
      msgContent = theName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;">`;
    }

    this.displayGeneralChatMessage(msgContent);
  }

  _onRollSaveTest(event) {
    event.preventDefault();
    let save = event.currentTarget.dataset.save;
    let targetValue = event.currentTarget.nextElementSibling.value
    return this._makeD20Test(save, targetValue, false);
  }

  _onSaveValueChange(event) {
    event.preventDefault();
    let proposedValue = event.currentTarget.value;
    if(proposedValue > 20) {
      event.currentTarget.value = 20;
      return;
    } else if(proposedValue < 2) {
      event.currentTarget.value = 2;
      return;
    }
    event.currentTarget.value = proposedValue;
  }

  /* -------------------------------------------------------------
    Utility Methods
  ----------------------------------------------------------------*/

  //performs a d20 roll for ability checks or saves
  async _makeD20Test(saveOrAbilityName, targetValue, isRollUnder) {

    let r = new Roll("1d20");

    // Execute the roll
    await r.evaluate({async: true});

    //determine success
    let isSuccess = false;
    if(r.total <= targetValue && isRollUnder) {
      isSuccess = true;
    } else if(r.total >= targetValue && !isRollUnder) {
      isSuccess = true;
    }

    //prep the template data and render the template
    const chatTemplateData = {
      titleText: this._createAbilityOrSaveTitleMessage(saveOrAbilityName),
      targetValue: targetValue,
      dieResult: r.total,
      isSuccess: isSuccess
    }
    const html = await renderTemplate("systems/loser/templates/chat/ability-or-save.html", chatTemplateData);

    const chatData = {
      type:  CONST.CHAT_MESSAGE_TYPES.ROLL,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: html};

    await r.toMessage(chatData);
    return r;
  }

  _createAbilityOrSaveTitleMessage(saveOrAbilityName) {

    let title = "";
    switch (saveOrAbilityName) {

      case "phys":
        title = "Physical Ability Check";
        break;
      case "dex":
        title = "Dexterity Ability Check";
        break;
      case "comp":
        title = "Comprehension Ability Check";
        break;
      case "cha":
        title = "Charisma Ability Check";
        break;

      case "pd":
        title = "Poison or Death Save";
        break;        
      case "pp":
        title = "Petrification or Polymorph Save";
        break; 
      case "bw":
        title = "Breath Weapon Save";
        break;
      case "lm":
        title = "Law Magic Save";
        break;
      case "cm":
        title = "Chaos Magic Save";
        break; 
      default:
        title = saveOrAbilityName;
    }
    return this.actor.name + ": " + title;
  }

   //sets booleans to make templating easier
 _setTemplateBooleans(context) {
  context.showClassControls = context.system.isPC || context.system.isNPC;
  context.hasEditableAlignment = context.system.isMonster || context.system.isDomesticated;
  context.hasSecondarySkill = context.system.isPC || context.system.isNPC;
  context.hasReadOnlyMovement = context.system.isPC || context.system.isNPC || context.system.isDomesticated;
  context.hasOtherAttributes = context.system.isPC || context.system.isNPC;
  context.hasLoyalty = context.system.isNPC;
  context.hasBAB = context.system.isMonster || context.system.isDomesticated;
  context.hasAbilityScores = context.system.isPC || context.system.isNPC;
  context.hasPCInventory = context.system.isPC || context.system.isNPC;
  context.hasCapabilities = context.system.isMonster || context.system.isDomesticated;
  context.hasLogistics = context.system.isDomesticated;
}

  //displays a chat message dedicated to a spell being cast (or uncast)
  displayChatMessageForSpellcasting(spellItem, uncast, withDescription) {

    if(spellItem.type != "spell") {
      return;
    }

    if(uncast === undefined) {
      uncast = false;
    }

    if(withDescription === undefined) {
      withDescription = false
    }

    const casterName = spellItem.actor.name;
    const spellName = spellItem.name;
    let description = "";
    const image = spellItem.img;
    let msgContent = "";

    if(withDescription) {
      description = spellItem.system.description;
    }

    if(uncast) {
      msgContent = casterName + `: UNCASTS the spell ` + spellName;
    } else {
      msgContent = casterName + `: casts the spell ` + spellName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;"><br>` + description;
    }

    const chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.IC,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: msgContent};

    ChatMessage.create(chatData);
 }

 //displays a generic chat message
 displayGeneralChatMessage(msg) {

  msg = this.actor.name + ": " + msg;
  const chatData = {
    type: CONST.CHAT_MESSAGE_TYPES.IC,
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: msg};
 
  ChatMessage.create(chatData, {});
 }

}