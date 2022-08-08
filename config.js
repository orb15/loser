
//LOSER config data
export const LOSER = {};

//---------------------------------------------------------------
// Constants
//---------------------------------------------------------------
LOSER.ASCII = `________________________

    |
    |
    |  ose R
    | 
    ========
________________________`

LOSER.MaxSpellMemorizeCount = 5;

LOSER.WeightChangePerPhysMod = 20;

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
  "heflin": "Heflin",
  "illusionist": "Illusionist",
  "normal-human": "Normal Human",
  "paladin": "Paladin",
  "warpriest": "Warpriest",
  "wizard": "Wizard"
};

LOSER.CharacterLevels = {
"0": 0,
"1": 1,
"2": 2,
"3": 3,
"4": 4,
"5": 5,
"6": 6,
"7": 7,
"8": 8,
"9": 9,
"10": 10,
"11": 11,
"12": 12,
}

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
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "beast-master": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "druid": {
    "isSpellcaster": true,
    "alignment": "True Neutral",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "dwarf": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Darkvision",
    "size": "Medium",
    "baseCarry": 90,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "elf": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Low Light",
    "size": "Medium",
    "baseCarry": 50,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "fighter": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "heflin": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Low Light",
    "size": "Medium",
    "baseCarry": 40,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "illusionist": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "normal-human": {
    "isSpellcaster": false,
    "alignment": "Neutral",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "paladin": {
    "isSpellcaster": true,
    "alignment": "Lawful",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "warpriest": {
    "isSpellcaster": true,
    "alignment": "Lawful",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
  },
  "wizard": {
    "isSpellcaster": true,
    "alignment": "Chaotic",
    "vision": "Normal",
    "size": "Medium",
    "baseCarry": 60,
    "baseOverland": 30,
    "baseTactical": 30
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

LOSER.Alignments = {
  "chaotic": "Chaotic",
  "neutral": "Neutral",
  "lawful": "Lawful",
  "true-neutral": "True Neutral"
}

//---------------------------------------------------------------
// Ability Scores
//---------------------------------------------------------------

LOSER.Abilities = {

  "phys": {
    "3": "Melee Modifier: -3|Thrown Weapon Modifier: -3|HP per Die: -3|Encumbrance Modifier: -3",
    "4": "Melee Modifier: -2|Thrown Weapon Modifier: -2|HP per Die: -2|Encumbrance Modifier: -2",
    "5": "Melee Modifier: -2|Thrown Weapon Modifier: -2|HP per Die: -2|Encumbrance Modifier: -2",
    "6": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Encumbrance Modifier: -1",
    "7": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Encumbrance Modifier: -1",
    "8": "Melee Modifier: -1|Thrown Weapon Modifier: -1|HP per Die: -1|Encumbrance Modifier: -1",
    "9": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Encumbrance Modifier: 0",
    "10": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Encumbrance Modifier: 0",
    "11": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Encumbrance Modifier: 0",
    "12": "Melee Modifier: 0|Thrown Weapon Modifier: 0|HP per Die: 0|Encumbrance Modifier: 0",
    "13": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Encumbrance Modifier: +1",
    "14": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Encumbrance Modifier: +1",
    "15": "Melee Modifier: +1|Thrown Weapon Modifier: +1|HP per Die: +1|Encumbrance Modifier: +1",
    "16": "Melee Modifier: +2|Thrown Weapon Modifier: +2|HP per Die: +2|Encumbrance Modifier: +2",
    "17": "Melee Modifier: +2|Thrown Weapon Modifier: +2|HP per Die: +2|Encumbrance Modifier: +2",
    "18": "Melee Modifier: +3|Thrown Weapon Modifier: +3|HP per Die: +3|Encumbrance Modifier: +3",
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
    "3": "Save Modifier: -3|NPC Reactions: -2|Max Retainers: 1|Base Loyalty: 4",
    "4": "Save Modifier: -2|NPC Reactions: -1|Max Retainers: 2|Base Loyalty: 5",
    "5": "Save Modifier: -2|NPC Reactions: -1|Max Retainers: 2|Base Loyalty: 5",
    "6": "Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "7": "Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "8": "Save Modifier: -1|NPC Reactions: -1|Max Retainers: 3|Base Loyalty: 6",
    "9": "Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "10": "Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "11": "Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "12": "Save Modifier: 0|NPC Reactions: 0|Max Retainers: 4|Base Loyalty: 7",
    "13": "Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "14": "Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "15": "Save Modifier: +1|NPC Reactions: +1|Max Retainers: 5|Base Loyalty: 8",
    "16": "Save Modifier: +2|NPC Reactions: +1|Max Retainers: 6|Base Loyalty: 9",
    "17": "Save Modifier: +2|NPC Reactions: +1|Max Retainers: 6|Base Loyalty: 9",
    "18": "Save Modifier: +3|NPC Reactions: +2|Max Retainers: 7|Base Loyalty: 10",
  }
};

LOSER.PhysBonus = {
  "3": -3,
  "4": -2,
  "5": -2,
  "6": -1,
  "7": -1,
  "8": -1,
  "9":  0,
  "10": 0,
  "11": 0,
  "12": 0,
  "13": 1,
  "14": 1,
  "15": 1,
  "16": 2,
  "17": 2,
  "18": 3
};

//---------------------------------------------------------------
// Features
//---------------------------------------------------------------
  LOSER.FeatureCategories = {
    "class": "Class",
    "language": "Language",
    "monster": "Monster",
    "other": "Other"
  };

//---------------------------------------------------------------
// ResourceDie
//---------------------------------------------------------------
LOSER.ResourceDice = {
  "N/A": "N/A",
  "0": "0",
  "4": "4",
  "6": "6",
  "8": "8",
  "10":"10",
  "12":"12"
};

//---------------------------------------------------------------
// Loot Coins + Gems Weight
//---------------------------------------------------------------
LOSER.CoinWeight = {
  "coinsPerPound": 50,
  "gemsPerPound": 100
};