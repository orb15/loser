
//preload template partials
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor Sheet Partials
    "systems/loser/templates/actors/parts/actor-inventory.html",
    "systems/loser/templates/actors/parts/actor-spells.html",

    // Item Sheet Partials
    "systems/loser/templates/items/parts/physdesc-partial-sheet.html",
  ]);
};