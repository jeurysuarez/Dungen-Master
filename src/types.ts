export interface Message {
  speaker: 'DM' | 'Player';
  text: string;
}

export interface Item {
    name: string;
    description: string;
    quantity: number;
}

export interface Spell {
    name: string;
    description: string;
    cost: number;
}

export interface Skill {
  name: string;
  description: string;
  cooldown: number; // The total number of turns for the cooldown
  turnsUntilReady: number; // How many turns are left until it's ready
}

export interface Character {
  name: string;
  class: string;
  race: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  attack: number;
  defense: number;
  inventory: Item[];
  spells: Spell[];
  skills: Skill[];
}

export interface Enemy {
  name: string;
  description: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

export interface DMEncounter {
    name: string;
    description: string;
    hp: number;
    attack: number;
    defense: number;
}

export interface DMPlayerUpdate {
    currentHp?: number;
    currentMp?: number;
}

export interface DMEnemyUpdate {
    currentHp?: number;
}

export interface DMLoot {
    items: { name: string, description: string, quantity: number }[]
}

export interface DMResponse {
    storyText: string;
    encounter?: DMEncounter;
    playerUpdate?: DMPlayerUpdate;
    enemyUpdate?: DMEnemyUpdate;
    loot?: DMLoot;
    combatOver?: boolean;
    xpAward?: number;
}
