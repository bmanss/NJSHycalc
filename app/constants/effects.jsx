import EffectInput from "../Components/EffectInput";

const black = "§0";
const blue = "§9";
const darkGreen = "§2";
const teal = "§3";
const darkRed = "§4";
const magenta = "§5";
const orange = "§6";
const gray = "§7";
const darkGray = "§8";
const mediumBlue = "§1";
const green = "§a";
const lightBlue = "§b";
const red = "§c";
const lightMagenta = "§e";
const yellow = "§e";
const white = "§f";

// common effects that get a reusable function
const modifyBaseMultiplier = (profileState, value) => {
  profileState.damageMultipliers.magicBaseMulti += value;
  profileState.damageMultipliers.regularBaseMulti += value;
};

const modifyPostMultiplier = (profileState, value) => {
  profileState.damageMultipliers.magicPostMulti *= value;
  profileState.damageMultipliers.regularPostMulti *= value;
};

const modifyStats = (profileState, statValues) => {
  for (const [stat, value] of Object.entries(statValues)) {
    profileState.finalStats[stat] += value;
  }
};

const modifyStatMultipliers = (profileState, multipliers) => {
  for (const [stat, value] of Object.entries(multipliers)) {
    profileState.statMultipliers[stat] += value;
  }
};

const incrementAllStatMultipliers = (profileState, value) => {
  for (const [stat, _] of Object.entries(profileState.statMultipliers)) {
    profileState.statMultipliers[stat] += value;
  }
};

const damageAgainstMobDesc = (amount, mobList) => {
  return `${gray}Deal ${green}${amount}% ${gray}against ${mobList.map((mob) => {
    return mob + " ";
  })}`;
};

const buffWeapon = (profileState, stats) => {
  const weapon = profileState.playerGear.weapon;
  const finalStats = profileState.finalStats;
  for (const [stat, value] of Object.entries(stats)) {
    if (profileState.dungeonMode && weapon.itemType === "dungeon") {
      finalStats.updateValue(stat, finalStats[stat] + value * weapon.dungeonStats.dungeonModifier);
      weapon.dungeonStats[stat] += value * weapon.dungeonStats.dungeonModifier;
    } else {
      weapon.nonDungeonStats[stat] += value;
      finalStats.updateValue(stat, finalStats[stat] + value);
    }
  }
};

function valuedTemplate(text) {
  return {
    valued: true,
    value: 0,
    valuedText: text,
    valuedDisplay(updateStats) {
      return (
        <EffectInput
          value={this.value}
          text={this.valuedText}
          onChange={(e) => {
            this.value = e;
            updateStats && updateStats();
          }}
        />
      );
    },
  };
}

export const valuedEffects = {
  EMERALD_BLADE: {
    ...valuedTemplate("Purse:"),
    name: "§6Ability: ",
    enabled: true,
    description: `${gray}A powerful blade made from pure
                  ${darkGreen} Emeralds${gray}. This blade becomes
                  ${gray}stronger as you carry more
                  ${orange}coins ${gray}in your purse.`,
    processEffect(profileState){
      const purse = this.value;
      const dmg = 2.5 * (purse ** (1/4));
      profileState.playerGear.weapon.nonDungeonStats.DAMAGE += dmg;
      profileState.finalStats.DAMAGE += dmg;
    }
  },
};

export const setEffects = {
  SUPERIOR_BLOOD: {
    required: 4,
    enabled: true,
    setEffect: true,
    name: "§6Full Set Bonus: Superior Blood",
    description: "§7Most of your stats are increased\n§7by §a5% §7and §6Aspect of the\n§6Dragons §7ability deals §a50%\n§7more damage.",
    processEffect: (profileState) => incrementAllStatMultipliers(profileState, 0.05),
  },
  STRONG_BLOOD: {
    required: 4,
    enabled: true,
    setEffect: true,
    name: "§6Full Set Bonus: Strong Blood",
    description: `${gray}Improves ${blue}the Aspect of the End:
                  ${red}+75 Damage
                  ${gray}Instant Transmission:
                  ${green}+2 ${gray}Teleport distance
                  ${green}+3 ${gray}seconds of duration
                  ${red}+5❁ Strength ${gray}on cast`,
    processEffect: (profileState) => {
      const weaponID = profileState.playerGear.weapon.id;
      if (weaponID === "ASPECT_OF_THE_END") {
        const stats = { DAMAGE: 75 };
        buffWeapon(profileState, stats);
      }
    },
  },
  ENRAGE: {
    name: "§6Ability: Enrage",
    required: 3,
    enabled: true,
    setEffect: true,
    description: `${gray}Enrage for ${green}6s ${gray}gaining ${white}100✦\n${white}Speed, ${red}100❁ Damage, ${gray}and ${red}100❁ Strength.\n${darkGray}Cooldown: ${green}25s`,
    processEffect: (profileState) => {
      const finalStats = profileState.finalStats;
      finalStats.updateValue("WALK_SPEED", finalStats["WALK_SPEED"] + 100);
      finalStats.updateValue("STRENGTH", finalStats["STRENGTH"] + 100);
      finalStats.updateValue("DAMAGE", finalStats["DAMAGE"] + 100);
    },
  },
  TROLLING_THE_REAPER: {
    name: "§6Ability: Trolling the Reaper ",
    required: 3,
    enabled: true,
    setEffect: true,
    description: `${gray}Healing Wands heal ${green}+50%.\n${gray}Gain ${green}+100 ❈ ${gray}Defense against Zombies.
                  ${gray}Deal ${red}+100% ${gray}damage to Zombies\n${gray}but  ${red}1% ${gray}to all other Mobs.`,
    processEffect: (profileState) => {
      if (profileState.targetMob === "Zombie") {
        modifyBaseMultiplier(profileState, 1);
      } else {
        // profileState.damageMultipliers.regularPostMulti = 0.1;
      }
    },
  },
};

export const effects = {
  BRUTE_FORCE: {
    name: "§6Ability: Brute Force",
    enabled: true,
    postEffect: true,
    description: "§7Halves your §f✦ Speed §7but\n§7grants §c+20% §7base weapon\n§7damage for every §a25 §f✦\n§fSpeed§7.",
    processEffect: (profileState) => {
      const finalStats = profileState.finalStats;
      finalStats.statCaps.WALK_SPEED /= 2;
      finalStats.updateValue("WALK_SPEED", finalStats.WALK_SPEED);
      const multi = (profileState.finalStats.WALK_SPEED / 25) * 0.2 + 1;
      profileState.damageMultipliers.regularBaseMulti += multi;
      profileState.damageMultipliers.magicBaseMulti += multi;
    },
  },
  ZOMBIE_BULWARK: {
    name: "§6Ability: Zombie Bulwark",
    description: `${gray}Kill Zombies to accumulate\n${gray}defense against them.`,
  },
  DAMAGE_AGAINST_MOBS: (effectAmount, displayAmount, mobList) => {
    return {
      name: `§6Ability:`,
      enabled: true,
      description: damageAgainstMobDesc(displayAmount, mobList),
      processEffect: (profileState) => {
        if (mobList.includes(profileState.targetMob)) {
          modifyPostMultiplier(profileState, effectAmount);
        }
      },
    };
  },
  HEART_STOPPER: {
    name: `§6Ability: Heartstopper`,
    enabled: false,
    description: `${gray}You have ${yellow}4 Ⓞ tickers
                  ${gray}Blocking clears ${yellow}1 Ⓞ ${gray}and heals ${red}60❤${gray}.
                  ${gray}Once all tickers are cleared,
                  ${gray}your next attack is empowered
                  ${gray}for ${red}250% damage.
                  ${darkGray}Tickers refill after 5 seconds`,
    processEffect: (profileState) => {
      modifyBaseMultiplier(profileState, 3.5);
    },
  },
  SOULCRY: (soulFlowCost, ferocityAmount) => {
    return {
      name: `§6Ability: Soulcry`,
      enabled: false,
      description: `${gray}Gain ${red}+${ferocityAmount}⫽ Ferocity ${gray}against
                    ${gray}Endermen for ${green}4s
                    ${darkGray}Soulflow Cost: ${teal}${soulFlowCost}
                    ${darkGray}Mana Cost: ${teal}200
                    ${darkGray}Cooldown: ${green}4s`,
      processEffect: (profileState) => {
        modifyStats(profileState, { FEROCITY: ferocityAmount });
      },
    };
  },
  RAMPART_CRIMSON: {
    name: "§6Ability:",
    enabled: true,
    description: `${gray}Grants ${red}+50❤ Health, 
                  ${red}+20❁ Strength${gray}, and ${blue}+15☠ Crit
                  ${blue}Damage ${gray}while on the ${red}Crimson 
                  ${red}Isle.`,
    processEffect: (profileState) => {
      modifyStats(profileState, { HEALTH: 50, STRENGTH: 20, CRITICAL_DAMAGE: 15 });
    },
  },
  LAVA_SEA_CREATURE: (dr, multi) => {
    return {
      name: "§6Ability:",
      enabled: true,
      description: `${gray}Damage taken from ${red}Lava Sea Creatures ${gray}is 
                    ${gray}reduced by ${green}${dr}% ${gray} and damage dealt is
                    ${gray}increased by ${red}${1 + multi}x`,
      processEffect: (profileState) => {
        if (profileState.targetMob === "Lava Sea Creature") modifyBaseMultiplier(profileState, multi);
      },
    };
  },
  TIERED_STATIC_CHARGE: {
    name: "§6Tiered Bonus: Static Charge",
    required: 2,
    setEffect: true,
    tiered: true,
    enabled: true,
    description: ``,
    tieredValues: {
      1: { seconds: 30, percent: 15, maxCharge: 2 },
      2: { seconds: 30, percent: 15, maxCharge: 2 },
      3: { seconds: 25, percent: 20, maxCharge: 3 },
      4: { seconds: 20, percent: 25, maxCharge: 4 },
      5: { seconds: 10, percent: 40, maxCharge: 5 },
    },
    updateDescription(tier) {
      const seconds = this.tieredValues[tier]?.seconds ?? 30;
      const percent = this.tieredValues[tier]?.percent ?? 15;
      const maxCharge = this.tieredValues[tier]?.maxCharge ?? 5;
      this.description = `${gray}Gains ${red}1 ${gray}static charge every
                          ${yellow}${seconds} ${gray}seconds
                          ${gray}Hitting a target will cause a
                          ${gray}discharge, adding ${green}${percent}% ${gray}damage
                          ${gray}to that hit for each charge collected.
                          ${darkGray}Maximum Charge Capacity: ${red}${maxCharge}`;
    },
    processEffect(profileState) {
      const tieredCount = profileState.armorSets[this.name];
      if (profileState.targetMob === "Lava Sea Creature") {
        modifyBaseMultiplier(profileState, this.tieredValues[tieredCount].percent / 100);
      }
      //TODO: Damage effect
    },
  },
  TIERED_FIREPROOF: {
    name: "§6Tiered Bonus: Fireproof",
    required: 2,
    enabled: true,
    setEffect: true,
    description: `${gray}Provides immunity to ${orange}nether magma.
                  ${darkGray}Armor Pieces Required: 2+`,
  },
  TIERED_LORDS_BLESSING: {
    name: "§6Tiered Bonus: Lord's Blessing ",
    required: 4,
    tiered: true,
    enabled: true,
    setEffect: true,
    description: ``,
    tieredValues: {
      1: { sc: 1, mf: 5 },
      2: { sc: 1, mf: 5 },
      3: { sc: 1, mf: 5 },
      4: { sc: 1, mf: 5 },
      5: { sc: 1.5, mf: 10 },
    },
    updateDescription(tier) {
      const sc = this.tieredValues[tier]?.sc ?? 1;
      const mf = this.tieredValues[tier]?.mf ?? 5;
      this.description = `${gray}Grants ${teal}+${sc}α Sea Creature Chance
                          ${gray}Grants ${lightBlue}+${mf} ✯Magic Find ${gray}on
                          ${red}Lava Sea Creatures.
                          ${darkGray}Armor Pieces Required: 4+`;
    },
    processEffect(profileState) {
      const tieredCount = profileState.armorSets[this.name];
      if (profileState.targetMob === "Lava Sea Creature") {
        modifyStats(profileState, { MAGIC_FIND: this.tieredValues[tieredCount].mf });
      }
    },
  },
  CROWN_OF_GREED: {
    name: "§6Ability: Zombie Bulwark",
    description: `${gray}Hits have ${red}+25% ${gray}base damage,
                  ${gray} but cost ${orange}100x ${gray} the weapon's
                  ${gray} base damage in ${orange}coins ${gray} from
                  ${gray} your purse.`,
    processEffect(profileState) {
      modifyPostMultiplier(profileState, 1.25);
    },
  },
};

/**
 * Map an Item's ID to its ingame effects
 */
export const itemEffectsMap = {
  WARDEN_HELMET: [effects.BRUTE_FORCE],
  SUPERIOR_DRAGON_HELMET: [setEffects.SUPERIOR_BLOOD],
  SUPERIOR_DRAGON_CHESTPLATE: [setEffects.SUPERIOR_BLOOD],
  SUPERIOR_DRAGON_LEGGINGS: [setEffects.SUPERIOR_BLOOD],
  SUPERIOR_DRAGON_BOOTS: [setEffects.SUPERIOR_BLOOD],

  STRONG_DRAGON_HELMET: [setEffects.STRONG_BLOOD],
  STRONG_DRAGON_CHESTPLATE: [setEffects.STRONG_BLOOD],
  STRONG_DRAGON_LEGGINGS: [setEffects.STRONG_BLOOD],
  STRONG_DRAGON_BOOTS: [setEffects.STRONG_BLOOD],
  REAPER_CHESTPLATE: [setEffects.ENRAGE, setEffects.TROLLING_THE_REAPER, effects.ZOMBIE_BULWARK],
  REAPER_LEGGINGS: [setEffects.ENRAGE, setEffects.TROLLING_THE_REAPER, effects.ZOMBIE_BULWARK],
  REAPER_BOOTS: [setEffects.ENRAGE, setEffects.TROLLING_THE_REAPER, effects.ZOMBIE_BULWARK],
  RAMPART_HELMET: [effects.RAMPART_CRIMSON],
  RAMPART_CHESTPLATE: [effects.RAMPART_CRIMSON],
  RAMPART_LEGGINGS: [effects.RAMPART_CRIMSON],
  RAMPART_BOOTS: [effects.RAMPART_CRIMSON],
  VOIDWALKER_KATANA: [effects.DAMAGE_AGAINST_MOBS(1.5, 150, ["Enderman"])],
  VOIDEDGE_KATANA: [effects.DAMAGE_AGAINST_MOBS(2, 200, ["Enderman"]), effects.SOULCRY(1, 200)],
  VORPAL_KATANA: [effects.DAMAGE_AGAINST_MOBS(2.5, 250, ["Enderman"]), effects.SOULCRY(1, 300)],
  ATOMSPLIT_KATANA: [effects.DAMAGE_AGAINST_MOBS(3, 300, ["Enderman"]), effects.SOULCRY(2, 400)],
  SCORPION_FOIL: [effects.DAMAGE_AGAINST_MOBS(2.5, 250, ["Spider"]), effects.HEART_STOPPER],
  TAURUS_HELMET: [effects.LAVA_SEA_CREATURE(5, 0.1)],
  FLAMING_CHESTPLATE: [effects.LAVA_SEA_CREATURE(5, 0.1)],
  MOOGMA_LEGGINGS: [effects.LAVA_SEA_CREATURE(5, 0.1)],
  THUNDER_HELMET: [effects.TIERED_STATIC_CHARGE, effects.LAVA_SEA_CREATURE(10, 0.2)],
  THUNDER_CHESTPLATE: [effects.TIERED_STATIC_CHARGE, effects.LAVA_SEA_CREATURE(10, 0.2)],
  THUNDER_LEGGINGS: [effects.TIERED_STATIC_CHARGE, effects.LAVA_SEA_CREATURE(10, 0.2)],
  THUNDER_BOOTS: [effects.TIERED_STATIC_CHARGE, effects.LAVA_SEA_CREATURE(10, 0.2)],
  THUNDERBOLT_NECKLACE: [effects.TIERED_STATIC_CHARGE, effects.LAVA_SEA_CREATURE(5, 0.1)],
  MAGMA_LORD_HELMET: [effects.TIERED_FIREPROOF, effects.TIERED_LORDS_BLESSING, effects.LAVA_SEA_CREATURE(15, 0.3)],
  MAGMA_LORD_CHESTPLATE: [effects.TIERED_FIREPROOF, effects.TIERED_LORDS_BLESSING, effects.LAVA_SEA_CREATURE(15, 0.3)],
  MAGMA_LORD_LEGGINGS: [effects.TIERED_FIREPROOF, effects.TIERED_LORDS_BLESSING, effects.LAVA_SEA_CREATURE(15, 0.3)],
  MAGMA_LORD_BOOTS: [effects.TIERED_FIREPROOF, effects.TIERED_LORDS_BLESSING, effects.LAVA_SEA_CREATURE(15, 0.3)],
  MAGMA_LORD_GAUNTLET: [effects.TIERED_FIREPROOF, effects.TIERED_LORDS_BLESSING, effects.LAVA_SEA_CREATURE(5, 0.1)],
  CROWN_OF_GREED: [effects.CROWN_OF_GREED],
  EMERALD_BLADE: [valuedEffects.EMERALD_BLADE],
};
