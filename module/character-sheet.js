export default class LoserCharacterSheet extends ActorSheet {
  
  constructor(...args) {
    super(...args);
  }
  

  static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["loser", "sheet", "actor", "playable", "character"],
      width: 720,
      height: 680
    });
  }
  
  getData() {
    const sheetData = super.getData();
    
    // The Actor's data
    const actorData = this.actor.data.toObject(false);
    sheetData.actor = actorData;
    sheetData.data = actorData.data;
  
    return sheetData;
  }
  
  get template(){
    return `systems/loser/template/actor/${this.actor.data.type}-sheet.html`;
  }
}