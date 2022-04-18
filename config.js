
//LOSER config data
export const LOSER = {};

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

LOSER.MaxSpellMemorizeCount = 5;

//---------------------------------------------------------------
// Character Basics
//---------------------------------------------------------------
LOSER.Backgrounds = {
  "blacksmith": "Blacksmith",
  "carpenter": "Carpenter",
  "cook": "Cook",
  "farmer": "Farmer",
  "fisher": "Fisher",
  "hunter": "Hunter",
  "mason": "Mason",
  "miner": "Miner",
  "other": "Other",
  "potter": "Potter",
  "rope-maker": "Rope Maker",
  "sailor": "Sailor",
  "stablehand": "Stablehand",
  "tailor": "Tailor",
  "temple-ward": "Temple Ward",
  "urchin": "Urchin",
  "waitstaff": "Waitstaff",
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

LOSER.ClassBaB = {
  "bard": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+2",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+5",
    "10": "+5",
    "11": "+5",
    "12": "+5",
  },

  "beast-master": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+2",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+5",
    "10": "+5",
    "11": "+5",
    "12": "+5",
  },

  "druid": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+2",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+5",
    "10": "+5",
    "11": "+5",
    "12": "+5",
  },

  "dwarf": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+2",
    "5": "+2",
    "6": "+2",
    "7": "+5",
    "8": "+5",
    "9": "+5",
    "10": "+7",
    "11": "+7",
    "12": "+7",
  },

  "elf": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+2",
    "5": "+2",
    "6": "+2",
    "7": "+5",
    "8": "+5",
    "9": "+5",
    "10": "+7",
    "11": "+7",
    "12": "+7",
  },

  "fighter": {
    "1": "+1",
    "2": "+1",
    "3": "+1",
    "4": "+2",
    "5": "+2",
    "6": "+2",
    "7": "+5",
    "8": "+5",
    "9": "+5",
    "10": "+7",
    "11": "+7",
    "12": "+7",
  },

  "heflin": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+2",
    "5": "+2",
    "6": "+2",
    "7": "+5",
    "8": "+5",
    "9": "+5",
    "10": "+7",
    "11": "+7",
    "12": "+7",
  },

  "illusionist": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+0",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+2",
    "10": "+2",
    "11": "+5",
    "12": "+5",
  },

  //normal-human is skipped on purpose - handled in code, always +0
  
  "paladin": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+2",
    "5": "+2",
    "6": "+2",
    "7": "+5",
    "8": "+5",
    "9": "+5",
    "10": "+7",
    "11": "+7",
    "12": "+7",
  },

  "warpriest": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+2",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+5",
    "10": "+5",
    "11": "+5",
    "12": "+5",
  },

  "wizard": {
    "1": "+0",
    "2": "+0",
    "3": "+0",
    "4": "+0",
    "5": "+0",
    "6": "+2",
    "7": "+2",
    "8": "+2",
    "9": "+2",
    "10": "+2",
    "11": "+5",
    "12": "+5",
  }
}

LOSER.ClassDetails = {
  "bard": {
    "isSpellcaster": true,
    "alignment": "True Neutral",
    "vision": "Normal",
    "size": "Medium",
  },
  "beast-master": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium"
  },
  "druid": {
    "isSpellcaster": true,
    "alignment": "True Neutral",
    "vision": "Normal",
    "size": "Medium"
  },
  "dwarf": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Darkvision",
    "size": "Medium"
  },
  "elf": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Low Light",
    "size": "Medium"
  },
  "fighter": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium"
  },
  "heflin": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Low Light",
    "size": "Medium"
  },
  "illusionist": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Normal",
    "size": "Medium"
  },
  "normal-human": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium"
  },
  "paladin": {
    "isSpellcaster": true,
    "alignment": "Lawful",
    "vision": "Normal",
    "size": "Medium"
  },
  "warpriest": {
    "isSpellcaster": true,
    "alignment": "Lawful",
    "vision": "Normal",
    "size": "Medium"
  },
  "wizard": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Normal",
    "size": "Medium"
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

  "druid": {
    "spellList": "druid",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
      "1": [1,0,0,0,0,0],
      "2": [2,0,0,0,0,0],
      "3": [2,1,0,0,0,0],
      "4": [2,2,0,0,0,0],
      "5": [2,2,1,1,0,0],
      "6": [2,2,2,1,1,0],
      "7": [3,3,2,2,1,0],
      "8": [3,3,3,2,2,0],
      "9": [4,4,3,3,2,0],
      "10": [4,4,4,3,3,0],
      "11": [5,5,4,4,3,0],
      "12": [5,5,5,4,4,0]
    }
  },

  "elf": {
    "spellList": "magic-user",
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
  },

  "illusionist": {
    "spellList": "illusionist",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
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
      "11": [4,3,3,3,2,1],
      "12": [4,4,3,3,3,2]
    }
  },

  "paladin": {
    "spellList": "cleric",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
      "1": [0,0,0,0,0,0],
      "2": [0,0,0,0,0,0],
      "3": [0,0,0,0,0,0],
      "4": [0,0,0,0,0,0],
      "5": [0,0,0,0,0,0],
      "6": [0,0,0,0,0,0],
      "7": [0,0,0,0,0,0],
      "8": [0,0,1,0,0,0],
      "9": [1,0,0,0,0,0],
      "10": [2,0,0,0,0,0],
      "11": [2,1,0,0,0,0],
      "12": [2,2,0,0,0,0]
    }
  },
  
  "warpriest": {
    "spellList": "cleric",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
      "1": [0,0,0,0,0,0],
      "2": [1,0,0,0,0,0],
      "3": [2,0,0,0,0,0],
      "4": [2,1,0,0,0,0],
      "5": [2,2,0,0,0,0],
      "6": [2,2,1,1,0,0],
      "7": [2,2,2,1,1,0],
      "8": [3,3,2,2,1,0],
      "9": [3,3,3,2,2,0],
      "10": [4,4,3,3,2,0],
      "11": [4,4,4,3,3,0],
      "12": [5,5,4,4,3,0],
    }
  },

  "wizard": {
    "spellList": "magic-user",
    "memorizes": true,
    "table": {
      "0": [0,0,0,0,0,0],
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
      "11": [4,3,3,3,2,1],
      "12": [4,4,3,3,3,2]
    }
  }
};

LOSER.SpellLists = {
  "druid": "Druid",
  "illusionist": "Illusionist",
  "cleric": "Cleric",
  "magic-user": "Magic User"
};

LOSER.SpellLevels = {
1: 1,
2: 2,
3: 3,
4: 4,
5: 5,
6: 6
};

//---------------------------------------------------------------
// Ability Scores
//---------------------------------------------------------------

LOSER.Abilities = {

  "phys": {
    "3": "Melee Modifier: -3|Thrown Weapon Modifier: -3|HP per Die: -3|Armor Allowed: Shield only",
    "4": "Melee Modifier: -2|Thrown Weapon Modifier: -2|HP per Die: -2|Armor Allowed: Light armor",
    "5": "Melee Modifier: -2|Thrown Weapon Modifier: -2|HP per Die: -2|Armor Allowed: Light armor",
    "6": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Armor Allowed: Medium armor",
    "7": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Armor Allowed: Medium armor",
    "8": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Armor Allowed: Medium armor",
    "9": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Armor Allowed: Heavy armor",
    "10": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Armor Allowed: Heavy armor",
    "11": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Armor Allowed: Heavy armor",
    "12": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Armor Allowed: Heavy armor",
    "13": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Armor Allowed: Heavy armor",
    "14": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Armor Allowed: Heavy armor",
    "15": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Armor Allowed: Heavy armor",
    "16": "Melee Modifier: +2|Thrown Weapon Modifier: +2|HP per Die: +2|Armor Allowed: Heavy armor",
    "17": "Melee Modifier: +2|Thrown Weapon Modifier: +2|HP per Die: +2|Armor Allowed: Heavy armor",
    "18": "Melee Modifier: +3|Thrown Weapon Modifier: +3|HP per Die: +3|Armor Allowed: Heavy armor"
  },

  "dex": {
    "3": "Ranged Weapon Modifier: -3|Thrown Weapon Modifier: -3|AC Modifier: -3",
    "4": "Ranged Weapon Modifier: -2|Thrown Weapon Modifier: -2|AC Modifier: -3",
    "5": "Ranged Weapon Modifier: -2|Thrown Weapon Modifier: -2|AC Modifier: -3",
    "6": "Ranged Weapon Modifier: -1|Thrown Weapon Modifier: -1|AC Modifier: -1",
    "7": "Ranged Weapon Modifier: -1|Thrown Weapon Modifier: -1|AC Modifier: -1",
    "8": "Ranged Weapon Modifier: -1|Thrown Weapon Modifier: -1|AC Modifier: -1",
    "9": "Ranged Weapon Modifier: 0|Thrown Weapon Modifier: 0|AC Modifier: 0",
    "10": "Ranged Weapon Modifier: 0|Thrown Weapon Modifier: 0|AC Modifier: 0",
    "11": "Ranged Weapon Modifier: 0|Thrown Weapon Modifier: 0|AC Modifier: 0",
    "12": "Ranged Weapon Modifier: 0|Thrown Weapon Modifier: 0|AC Modifier: 0",
    "13": "Ranged Weapon Modifier: +1|Thrown Weapon Modifier: +1|AC Modifier: +1",
    "14": "Ranged Weapon Modifier: +1|Thrown Weapon Modifier: +1|AC Modifier: +1",
    "15": "Ranged Weapon Modifier: +1|Thrown Weapon Modifier: +1|AC Modifier: +1",
    "16": "Ranged Weapon Modifier: +2|Thrown Weapon Modifier: +2|AC Modifier: +2",
    "17": "Ranged Weapon Modifier: +2|Thrown Weapon Modifier: +2|AC Modifier: +2",
    "18": "Ranged Weapon Modifier: +3|Thrown Weapon Modifier: +3|AC Modifier: +3",
  },

  "comp": {
    "3": "Spoken Languages: Native (broken speech)|Native Literacy: Illiterate|Human XP Gain: -15%|Non-human XP Gain: -15%",
    "4": "Spoken Languages: Native|Native Literacy: Illiterate|Human XP Gain: -10%|Non-human XP Gain: -10%",
    "5": "Spoken Languages: Native|Native Literacy: Illiterate|Human XP Gain: -10%|Non-human XP Gain: -10%",
    "6": "Spoken Languages: Native|Native Literacy: Basic|Human XP Gain: -5%|Non-human XP Gain: -5%",
    "7": "Spoken Languages: Native|Native Literacy: Basic|Human XP Gain: -5%|Non-human XP Gain: -5%",
    "8": "Spoken Languages: Native|Native Literacy: Basic|Human XP Gain: -5%|Non-human XP Gain: -5%",
    "9": "Spoken Languages: Native|Native Literacy: Literate|Human XP Gain: 0%|Non-human XP Gain: 0%",
    "10": "Spoken Languages: Native|Native Literacy: Literate|Human XP Gain: 0%|Non-human XP Gain: 0%",
    "11": "Spoken Languages: Native|Native Literacy: Literate|Human XP Gain: 0%|Non-human XP Gain: 0%",
    "12": "Spoken Languages: Native|Native Literacy: Literate|Human XP Gain: 0%|Non-human XP Gain: 0%",
    "13": "Spoken Languages: Native + 1|Native Literacy: Literate|Human XP Gain: +5%|Non-human XP Gain: 0%",
    "14": "Spoken Languages: Native + 1|Native Literacy: Literate|Human XP Gain: +5%|Non-human XP Gain: 0%",
    "15": "Spoken Languages: Native + 1|Native Literacy: Literate|Human XP Gain: +5%|Non-human XP Gain: 0%",
    "16": "Spoken Languages: Native + 2|Native Literacy: Literate|Human XP Gain: +10%|Non-human XP Gain: +5%",
    "17": "Spoken Languages: Native + 2|Native Literacy: Literate|Human XP Gain: +10%|Non-human XP Gain: +5%",
    "18": "Spoken Languages: Native + 3|Native Literacy: Literate|Human XP Gain: +15%|Non-human XP Gain: +10%"
  },

  "cha": {
    "3": "Magical Save Modifier: -3|NPC Reactions: -2|Max Retainers: 1|Base Loyalty: 4",
    "4": "Magical Save Modifier: -2|NPC Reactions: -1|Max Retainers: 2|Base Loyalty: 5",
    "5": "Magical Save Modifier: -2|NPC Reactions: -1|Max Retainers: 2|Base Loyalty: 5",
    "6": "Magical Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "7": "Magical Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "8": "Magical Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "9": "Magical Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "10": "Magical Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "11": "Magical Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "12": "Magical Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "13": "Magical Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "14": "Magical Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "15": "Magical Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "16": "Magical Save Modifier: +2|NPC Reactions: +1|Max Retainers: 6|Base Loyalty: 9",
    "17": "Magical Save Modifier: +2|NPC Reactions: +1|Max Retainers: 6|Base Loyalty: 9",
    "18": "Magical Save Modifier: +3|NPC Reactions: +2|Max Retainers: 7|Base Loyalty: 10",
  }

};