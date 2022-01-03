import LoserCharacterSheet from "./module/character-sheet.js";

// -----------------------------
// Hooks - Initialization
// -----------------------------

Hooks.once("init", function(){
  
  console.log("LoseR | Begin Init Hook...");
  
  //unregister the core / builtin actor sheet and register my character actor sheet subclass
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("loser", LoserCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Character Sheet"
  });
  
  //TODO: register sheets for NPC and Monsters here
  
  console.log("LoseR | Init Hook complete");
});