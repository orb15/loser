import LoserCharacterSheet from "./apps/sheets/actors/character-sheet.js";
import LoserEquipmentItemSheet from "./apps/sheets/items/equipment-sheet.js";
import LoserWeaponItemSheet from "./apps/sheets/items/weapon-sheet.js";
import LoserArmorItemSheet from "./apps/sheets/items/armor-sheet.js";
import LoserLootItemSheet from "./apps/sheets/items/loot-sheet.js";
import { preloadHandlebarsTemplates } from "./apps/template-partials.js";
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
    label: "Player Character Sheet"
  });
  
  //register NPC sheet
    Actors.registerSheet("loser", LoserCharacterSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "NPC Character Sheet"
  });
  
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("loser", LoserEquipmentItemSheet, {
    types: ["equipment"],
    makeDefault: true,
    label: "Item - Equipment"
  });

  Items.registerSheet("loser", LoserWeaponItemSheet, {
    types: ["weapon"],
    makeDefault: true,
    label: "Item - Weapon"
  });

  Items.registerSheet("loser", LoserArmorItemSheet, {
    types: ["armor"],
    makeDefault: true,
    label: "Item - Armor"
  });

  Items.registerSheet("loser", LoserLootItemSheet, {
    types: ["loot"],
    makeDefault: true,
    label: "Item - Loot"
  });
  
  // Preload Handlebars Templates
  return preloadHandlebarsTemplates();
  
  console.log("LoseR | Init Hook complete");
});