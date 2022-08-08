import LoserCharacterSheet from "./apps/sheets/actors/character-sheet.js";
import LoserMonsterSheet from "./apps/sheets/actors/monster-sheet.js";
import LoserDomesticatedSheet from "./apps/sheets/actors/domesticated-sheet.js";
import LoserEquipmentItemSheet from "./apps/sheets/items/equipment-sheet.js";
import LoserWeaponItemSheet from "./apps/sheets/items/weapon-sheet.js";
import LoserArmorItemSheet from "./apps/sheets/items/armor-sheet.js";
import LoserLootItemSheet from "./apps/sheets/items/loot-sheet.js";
import LoserCurrencyItemSheet from "./apps/sheets/items/currency-sheet.js";
import LoserSpellItemSheet from "./apps/sheets/items/spell-sheet.js";
import LoserFeatureItemSheet from "./apps/sheets/items/feature-sheet.js";
import LoserLogisticItemSheet from "./apps/sheets/items/logistic-sheet.js";

import { preloadHandlebarsTemplates } from "./apps/template-partials.js";
import {LOSER} from "./config.js";



// -----------------------------
// Hooks - Initialization
// -----------------------------

Hooks.once("init", function(){

  console.log(`LoseR | Begin Initinitialization\n${LOSER.ASCII}`);

  // ================================
  //  Register LOSER-specific CONFIG
  // ================================
  CONFIG.LOSER = LOSER;

  // ================================
  //  Register Sheets
  // ================================
  
  //unregister the core / builtin actor sheet and register the character actor sheet subclass
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

  //register Monster sheet
  Actors.registerSheet("loser", LoserMonsterSheet, {
    types: ["monster"],
    makeDefault: true,
    label: "Monster Character Sheet"
  });

    //register Domesticated sheet
    Actors.registerSheet("loser", LoserDomesticatedSheet, {
      types: ["domesticated"],
      makeDefault: true,
      label: "Monster Character Sheet"
    });
  
  //register all the item sheets
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

  Items.registerSheet("loser", LoserCurrencyItemSheet, {
    types: ["currency"],
    makeDefault: true,
    label: "Item - Currency"
  });

  Items.registerSheet("loser", LoserSpellItemSheet, {
    types: ["spell"],
    makeDefault: true,
    label: "Item - Spell"
  });

  Items.registerSheet("loser", LoserFeatureItemSheet, {
    types: ["feature"],
    makeDefault: true,
    label: "Item - Feature"
  });

  Items.registerSheet("loser", LoserLogisticItemSheet, {
    types: ["logistic"],
    makeDefault: true,
    label: "Item - Logistic"
  });
  
  // ================================
  //  Post-Init Logging
  // ================================
  console.log("LoseR | Initialization Complete");

  // ================================
  //  Preload Handlebars Templates
  // ================================
  return preloadHandlebarsTemplates();
  

});