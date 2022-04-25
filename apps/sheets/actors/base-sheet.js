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

    const data = {};

    // The Actor's data
    const actorData = this.actor.data.toObject(false);
    const source = this.actor.data._source.data;
    data.actor = actorData;
    data.data = actorData.data;

    //common data code for all sheets

    //cache all of this data in the charsheet object for easy reference in any charsheet
    this.dataCache = data;

    // Note the use of data.data here. Data.data is sent to the template, where it is de-referenced
    // as just 'data' to access what is stored here

    //add the LOSER config to make building select boxes easy
    data.data.config = CONFIG.LOSER;

    return data;
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
        case "logistic":
          inventory.logistics.items.push(item);
          item.slots = Utils.calcSlots(item);
          inventory.logistics.slots += item.slots;
          break;
      }
    })

    //sort the various arrays by slots used then by name
    inventory.weapon.items.sort(this._inventorySorter)
    inventory.armor.items.sort(this._inventorySorter)
    inventory.equipment.items.sort(this._inventorySorter)
    inventory.loot.items.sort(this._inventorySorter)
    inventory.currency.items.sort(this._inventorySorter)
    inventory.logistics.items.sort(this._inventorySorter)

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
    total += (allItems.data.gems.sp1000 * 1000) + (allItems.data.gems.sp2500 * 2500) + (allItems.data.gems.sp5000 * 5000);
    
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
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    
    const featName = item.data.name;
    let description = "";
    const image = item.data.img;
    let msgContent = "";

    if(event.ctrlKey) {
      description = item.data.data.description;
      msgContent = featName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;"><br>` + description;
    } else {
      msgContent = featName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;">`;
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
    return title;
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
    const spellName = spellItem.data.name;
    let description = "";
    const image = spellItem.data.img;
    let msgContent = "";

    if(withDescription) {
      description = spellItem.data.data.description;
    }

    if(uncast) {
      msgContent = casterName + ` UNCASTS a spell: ` + spellName;
    } else {
      msgContent = casterName + ` casts a spell: ` + spellName + `<hr><br>` + `<img src="` + image + `" style="height:45px;border:none;margin-top:-18px;"><br>` + description;
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
  const chatData = {
    type: CONST.CHAT_MESSAGE_TYPES.IC,
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: msg};
 
  ChatMessage.create(chatData, {});
 }

}