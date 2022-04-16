


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
    Useful Methods
  ----------------------------------------------------------------*/

  /*
  let modifiers = 9;
let r = new Roll('1d20');
await r.evaluate();
let rawRoll = r.total;
let total = rawRoll + modifiers;
let msgContent = `<h2><span style='color:Purple'>Ursirion Spell Attack</span></h2></br>`;
let evalTxt = `<h3>Rolled: ${rawRoll}</br>Modifiers: ${modifiers}</br>Usirion's Total: ${total}</h3>`
msgContent = msgContent + evalTxt;
var chatData = {
   type: CONST.CHAT_MESSAGE_TYPES.ROLL,
   roll: r,
   user: game.user._id,
   speaker: ChatMessage.getSpeaker(),
   content: msgContent};

ChatMessage.create(chatData, {});
  */

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

}