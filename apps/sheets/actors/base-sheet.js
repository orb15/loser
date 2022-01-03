


// This class provides base functionality for all Actor sheets
export default class LoserActorSheetBase extends ActorSheet {
  constructor(...args) {
    super(...args);
  }


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
}