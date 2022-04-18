import LoserActorSheetBase from "./base-sheet.js";

// This class provides core functionality for the Character and NPC
// Character Sheets
export default class LoserMonsterSheet extends LoserActorSheetBase {
  
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
      
    //Saving Throws - onClick
    html.find(".event-saves-name").click(this._onRollSaveTest.bind(this));
    
    //Inventory - Item Edit & Delete icons
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    //establish default listeners
    super.activateListeners(html);
  }

  /* -------------------------------------------------------------
    Event Handlers
  ----------------------------------------------------------------*/
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


  _onSpellCast(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    this.displayChatMessageForSpellcasting(item, false, event.ctrlKey);
  }

  /* -------------------------------------------------------------
    Utility and Helper Methods
  ----------------------------------------------------------------*/

  //prints a warning and chatlog message if character is overloaded
  _warnOnExcessiveSlotsUsed() {
    const totalSlots = this.dataCache.data.totalSlots;
    const className = this.dataCache.data.className;

    let needsWarning = false;
    let msg = "";

    //TODO: probbaly need to do something here for beasts of burden
    if(needsWarning) {
      ui.notifications.warn(`${msg}`);
      this.displayGeneralChatMessage(msg);
    }

  }
}