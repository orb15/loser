
//LOSER config data
export const LOSER = {};

//IMPORTANT: Do NOT reorder the lists here - it can cause issues with any existing data.
//See note in spell-sheet.js for an example!

//---------------------------------------------------------------
// Constants
//---------------------------------------------------------------
LOSER.ASCII = `________________________

    |
    |
    |  oseR
    | 
    ========
________________________`

LOSER.MaxSpellMemorizeCount = 4;

//---------------------------------------------------------------
// Character Basics
//---------------------------------------------------------------
LOSER.Backgrounds = {
  "animal-handler": "Animal Handler",
  "blacksmith": "Blacksmith",
  "bowyer": "Bowyer",
  "carpenter": "Carpenter",
  "cook": "Cook",
  "farmer": "Farmer",
  "fisher": "Fisher",
  "hunter": "Hunter",
  "mason": "Mason",
  "miner": "Miner",
  "potter": "Potter",
  "rope-maker": "Rope Maker",
  "sailor": "Sailor",
  "tailor": "Tailor",
  "woodcutter": "Woodcutter"
};

LOSER.Classes = {
  "bard": "Bard",
  "beast-master": "Beast Master",
  "druid": "Druid",
  "dwarf": "Dwarf",
  "elf": "Elf",
  "fighter": "Fighter",
  "heflin": "HEflin",
  "illusionist": "Illusionist",
  "normal-human": "Normal Human",
  "paladin": "Paladin",
  "warpriest": "Warpriest",
  "wizard": "Wizard"
};

LOSER.ClassDetails = {
  "bard": {
    "isSpellcaster": true,
    "alignment": "true neutral"
  },
  "beast-master": {
    "isSpellcaster": false,
    "alignment": "neutral"
  },
  "druid": {
    "isSpellcaster": true,
    "alignment": "true neutral"
  },
  "dwarf": {
    "isSpellcaster": false,
    "alignment": "neutral"
  },
  "elf": {
    "isSpellcaster": true,
    "alignment": "chaotic"
  },
  "fighter": {
    "isSpellcaster": false,
    "alignment": "neutral"
  },
  "heflin": {
    "isSpellcaster": false,
    "alignment": "neutral"
  },
  "illusionist": {
    "isSpellcaster": true,
    "alignment": "chaotic"
  },
  "normal-human": {
    "isSpellcaster": false,
    "alignment": "neutral"
  },
  "paladin": {
    "isSpellcaster": true,
    "alignment": "lawful"
  },
  "warpriest": {
    "isSpellcaster": true,
    "alignment": "lawful"
  },
  "wizard": {
    "isSpellcaster": true,
    "alignment": "chaotic"
  }
};

LOSER.Spellcasters = {

  "bard": {
    "spellList": "druid",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
      "1": [0,0,0,0,0,0],
      "2": [1,0,0,0,0,0],
      "3": [2,0,0,0,0,0],
      "4": [3,0,0,0,0,0],
      "5": [3,1,0,0,0,0],
      "6": [3,2,0,0,0,0],
      "7": [3,3,0,0,0,0],
      "8": [3,3,1,0,0,0],
      "9": [3,3,2,0,0,0],
      "10": [3,3,3,0,0,0],
      "11": [3,3,3,1,0,0],
      "12": [3,3,3,2,0,0]
    }
  },

  "elf": {
    "spellList": "wizard",
    "memorizes": false,
    "table": {
      "0": [1,0,0,0,0,0],
      "1": [1,0,0,0,0,0],
      "2": [2,0,0,0,0,0],
      "3": [2,1,0,0,0,0],
      "4": [2,2,0,0,0,0],
      "5": [2,2,1,0,0,0],
      "6": [2,2,2,0,0,0],
      "7": [3,2,2,1,0,0],
      "8": [3,3,2,2,0,0],
      "9": [3,3,3,2,1,0],
      "10": [3,3,3,3,2,0],
      "11": [3,3,3,3,2,0],
      "12": [3,3,3,3,2,0]
    }
  }
};

LOSER.SpellLists = {
  "druid": "Druid",
  "illusionist": "Illusionist",
  "warpriest": "Warpriest",
  "wizard": "Wizard"
};

LOSER.SpellLevels = {
1: 1,
2: 2,
3: 3,
4: 4,
5: 5,
6: 6
};