


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

    return data;
  }

  /* -------------------------------------------------------------
    EventHandlers
  ----------------------------------------------------------------*/

  _onShowFeature(event) {
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

  /* -------------------------------------------------------------
    Utility Methods
  ----------------------------------------------------------------*/

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

    ChatMessage.create(chatData, {});
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