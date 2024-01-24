import { valuedTemplate } from "./effects";

const black = "§0";
const blue = "§9";
const darkGreen = "§2";
const teal = "§3";
const darkRed = "§4";
const purple = "§5";
const orange = "§6";
const gray = "§7";
const darkGray = "§8";
const mediumBlue = "§1";
const green = "§a";
const lightBlue = "§b";
const red = "§c";
const magenta = "§d";
const yellow = "§e";
const white = "§f";

function formatValue(value){
    return value.toFixed(1);
}

export const pets = {
    TIGER: {
        baseStats: {
            STRENGTH: 5
        },
        statsPerLevel: {
            STRENGTH: 0.1,
            FEROCITY: 0.25,
            CRITICAL_CHANCE: 0.05,
            CRITICAL_DAMAGE: 0.5
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Merciless Swipe',
                minRarity: 'COMMON',
                resultType: 'globalMultiplier-multi',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        FEROCITY: {
                            COMMON: 0.1,
                            UNCOMMON: 0.2,
                            RARE: 0.2,
                            EPIC: 0.3,
                            LEGENDARY: 0.3
                        }
                    }
                    const value = stats.FEROCITY[tier] ? stats.FEROCITY[tier] * petLevel : stats.FEROCITY.LEGENDARY * petLevel;
                    return {
                        FEROCITY: 1 + (value / 100)
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.2,
                        RARE: 0.2,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Gain ${red}+${formatValue(initialVal[tier] * petLevel)}%⫽ Ferocity.`;
                }
            },
            {
                name: 'Hemorrage ',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.3,
                        EPIC: 0.55,
                        LEGENDARY: 0.55
                    }
                    return `${gray}Melee attacks reduce healing by ${orange}${formatValue(initialVal[tier] * petLevel)}%${gray} for 10 seconds.`;
                }
            },
            {
                name: 'Apex Predator',
                minRarity: 'LEGENDARY',
                resultType: 'baseMultiplier',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const value = 1 * petLevel;
                    return (value / 100);
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 1
                    }
                    return `${gray}Deal ${red}+${(initialVal[tier] * petLevel)}% ${gray}damage ${gray}against targets with no other mobs within 15 blocks`;
                }
            }
        ]
    },
    LION: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            FEROCITY: 0.05,
            WALK_SPEED: 0.25
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Primal Force',
                minRarity: 'COMMON',
                resultType: 'weaponStats',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        COMMON: {DAMAGE: 0.03,STRENGTH: 0.03},
                        UNCOMMON: {DAMAGE: 0.05,STRENGTH: 0.05},
                        RARE: {DAMAGE: 0.1,STRENGTH: 0.1},
                        EPIC: {DAMAGE: 0.15,STRENGTH: 0.15},
                        LEGENDARY: {DAMAGE: 0.2,STRENGTH: 0.2},
                    }
                    return {
                        STRENGTH: stats[tier]?.STRENGTH ? stats[tier].STRENGTH * petLevel : stats.LEGENDARY.STRENGTH * petLevel,
                        DAMAGE: stats[tier]?.DAMAGE ? stats[tier].DAMAGE * petLevel : stats.LEGENDARY.DAMAGE * petLevel,
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: { DAMAGE: 0.03, STRENGTH: 0.03 },
                        UNCOMMON: { DAMAGE: 0.05, STRENGTH: 0.05 },
                        RARE: { DAMAGE: 0.1, STRENGTH: 0.1 },
                        EPIC: { DAMAGE: 0.15, STRENGTH: 0.15 },
                        LEGENDARY: { DAMAGE: 0.2, STRENGTH: 0.2 },
                    }
                    return `${gray}Adds ${red}+${formatValue(initialVal[tier].DAMAGE * petLevel)} Damage${gray} and ${red}+${formatValue(initialVal[tier].STRENGTH * petLevel)} Strength${gray} to your weapons.`;
                }
            },
            {
                name: 'First Pounce',
                minRarity: 'RARE',
                resultType: 'firstPounce',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    const value =  stats[tier] * petLevel;
                    return (value / 100);
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    return `${gray}First strike, Triple-strike, and Combo are ${green}+${formatValue(initialVal[tier] * petLevel)}%${gray} more effective.`;
                },
            },
            {
                name: 'King of the Jungle',
                minRarity: 'LEGENDARY',
                resultType: 'baseMultiplier',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const value =  1.5 * petLevel;
                    return (value / 100);
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 1.5
                    }
                    return `${gray}Deal ${red}+${formatValue(initialVal[tier] * petLevel)}% Damage${gray} against mobs that have attacked you.`;
                },
                'action': 'baseMultiplierPerLevel',
                'type': 'additive',
                'amountPerLevel': [
                    1.5
                ]
            }
        ]
    },
    BAL: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.25,
            FEROCITY: 0.1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Protective Skin',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gives ${red}Heat${gray} immunity.`;
                },
            },
            {
                name: 'Fire Whip',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.1,
                        LEGENDARY: 0.1
                    }
                    return `${gray}Every 5s while in combat the Balrog will strike nearby enemies with his fire whip dealing ${red}${formatValue(initialVal[tier] * petLevel)}%${gray} of your damage as ${white}True Damage${gray}`;
                },
            },
            {
                name: 'Made of Lava',
                minRarity: 'LEGENDARY',
                resultType: 'globalMultiplier-multi-all',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const value = (0.15 * petLevel);
                    return {
                        percentage: 1 + (value / 100)
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 0.15
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} on ALL stats when inside the ${red}Magma Fields.`;
                },
            }
        ]
    },
    'BLACK CAT': {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            WALK_SPEED: 0.25
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'blackCatSpeed',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        WALK_SPEED: 1 * petLevel
                    }
                },
                name: 'Hunter',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 1
                    }
                    return `${gray}Increases your ${white}✦ Speed${gray} and speed cap by ${green}${formatValue(initialVal[tier] * petLevel)}`;
                },
            },
            {
                name: 'Omen',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 0.15
                    }
                    return `${gray}Grants ${green}${formatValue(initialVal[tier] * petLevel)}${magenta} ♣ Pet Luck${gray}.`;
                },
                'action': 'none'
            },
            {
                resultType: 'basicStats',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        MAGIC_FIND: petLevel * 0.15
                    }
                },
                name: 'Supernatural',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 0.15
                    }
                    return `${gray}Grants ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} ${lightBlue}✯Magic Find${gray}.`;
                },
            }
        ]
    },
    BLAZE: {
        baseStats: {
            DEFENSE: 10
        },
        statsPerLevel: {
            DEFENSE: 0.2,
            INTELLIGENCE: 1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'globalMultiplier-multi-all',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const value = (0.1 * petLevel);
                    return {
                        percentage: 1 + (value / 100)
                    }
                },
                name: 'Nether Embodiment',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.1,
                        LEGENDARY: 0.1
                    }
                    return `${gray}Increases all stats by ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}while on the ${red}Crimson Isle.`;
                },
            },
            {
                resultType: 'armorStatsBuff',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.4 * petLevel;
                    return {
                        armorKeyword: 'BLAZE',
                        percentage: 1 + (value / 100)
                    }
                },
                name: 'Bling Armor',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.4,
                        LEGENDARY: 0.4
                    }
                    return `${gray}Upgrades ${red}Blaze Armor ${gray}stats and ability by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
            },
            {
                resultType: 'doubleBooks',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return 2;
                },
                name: 'Fusion-Style Potato',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Double effects of Hot Potato Books.`;
                },
            }
        ]
    },
    'ENDER DRAGON': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            CRITICAL_CHANCE: 0.1,
            CRITICAL_DAMAGE: 0.5
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'baseMultiplier',
                condition: {
                    requirement: 'targetMob',
                    validParameters: ['Enderman']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = (2 * petLevel) + 100;
                    return value / 100;
                },
                name: 'End Strike',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Deal ${green}${formatValue(2 * petLevel)}%${gray} more damage to end mobs.`;
                },
            },
            {
                resultType: 'buffWeapon',
                condition: {
                    requirement: 'weapon',
                    validParameters: ['ASPECT_OF_THE_DRAGON']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        DAMAGE: 0.5 * petLevel,
                        STRENGTH: 0.3 * petLevel
                    }
                },
                name: 'One with the Dragons',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Buffs the ${red}Aspect of the Dragons ${gray}sword by ${green}${formatValue(0.5 * petLevel)} ${red}❁Damage${gray} and ${green}${formatValue(0.3 * petLevel)} ${red}❁Strength${gray}.`;
                },
            },
            {
                resultType: 'globalMultiplier-add-all',
                enabled: true,
                // processEffect: (profileState) =>{
                //     const increaseValue = (0.1 * profileState.playerGear.pet.level) / 100;
                //     for (const [stat,_] of Object.entries(profileState.statMultipliers)){
                //         profileState.statMultipliers[stat] += increaseValue;
                //     };
                // },
                effectResults: (petLevel, tier) => {
                    return { percentage: (0.1 * petLevel) / 100 }
                },
                name: 'Superior',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 0.1
                    }
                    return `${gray}Increases most stats by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;

                },
            }
        ]
    },
    MEGALODON: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            MAGIC_FIND: 0.1,
            FEROCITY: 0.05
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Blood Scent',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Deal up to ${red}+${formatValue(0.25 * petLevel)}% ❁Damage${gray} based on the enemy\'s missing health.`;
                },
                'action': 'none'
            },
            {
                resultType: 'armorStatsBuff',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.2 * petLevel;
                    return {
                        armorKeyword: 'SHARK_SCALE',
                        percentage: 1 + (value / 100)
                    }
                },
                name: 'Enhanced Scales',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Increases the stats of Shark Armor by ${green}${formatValue(0.25 * petLevel)}%.`;
                },
            },
            {
                name: 'Feeding Frenzy',
                minRarity: 'LEGENDARY',
                resultType: 'basicStats',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        DAMAGE: petLevel * 0.5,
                        WALK_SPEED: petLevel * 0.5
                    }
                },
                description: (petLevel, tier) => {
                    return `${gray}On kill gain ${red}${formatValue(0.5 * petLevel)} ❁Damage${gray} and ${white}✦Speed${gray} for 5 seconds.`;
                },
                'action': 'none'
            }
        ]
    },
    'GOLDEN DRAGON': {
        baseStats: {
            ATTACK_SPEED: 0,
            STRENGTH: 0,
            MAGIC_FIND: 0
        },
        statsPerLevel: {
            ATTACK_SPEED: 0.25,
            STRENGTH: 0.25,
            MAGIC_FIND: 0.05
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Gold\'s Power',
                enabled:true,
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Adds ${red}+${formatValue(0.5 * (petLevel - 100) + 50)} Strength${gray} to all golden weapons.`;
                },
                //TODO: account for stars
                processEffect: (profileState) => {
                    const weapon = profileState.playerGear.weapon;
                    const pet = profileState.playerGear.pet;

                    const strengthValue = 0.5 * (pet.level - 100) + 50;
                    if (weapon?.material?.includes('GOLD')){
                        weapon.nonDungeonStats.STRENGTH += strengthValue;
                        profileState.finalStats.STRENGTH += strengthValue;
                    }
                },
            },
            {
                name: 'Shining Scales',
                enabled:true,
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${red}+10 Strength${gray} and ${lightBlue}+2 Magic Find${gray} to your pet for each digit in your gold collection.`;
                },
                processEffect: (profileState) => {
                    const pet = profileState.playerGear.pet;
                    const goldCollection = profileState.playerCollections.MINING['Gold Ingot'].amount;
                    const goldDigits = String(goldCollection).length;
                    const strengthValue = Number(goldDigits) * 10;
                    const mfValue = Number(goldDigits) * 2;
                    pet.stats.STRENGTH += strengthValue;
                    pet.stats.MAGIC_FIND += mfValue;

                    profileState.finalStats.STRENGTH += strengthValue;
                    profileState.finalStats.MAGIC_FIND += mfValue;
                },
            },
            {
                name: 'Dragon\'s Greed',
                enabled: true,
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${red}+${(0.0025 * (petLevel - 100) + 0.25).toFixed(2)}% Strength${gray} per ${lightBlue}5 Magic Find${gray}.`;
                },
                processEffect: (profileState) => {
                    const magicFindCap = 50;
                    const pet = profileState.playerGear.pet;
                    const strengthPerMagic = 0.0025 * (pet.level - 100) + 0.25;
                    const magicValue = Math.min(profileState.finalStats.MAGIC_FIND,magicFindCap ) / 5
                    const strengthMulti = strengthPerMagic * magicValue;
                    profileState.statMultipliers.STRENGTH += strengthMulti / 100;
                },
            },
            {
                ...valuedTemplate("Bank:"),
                name: 'Legendary Treasure',
                enabled:true,
                value: 0,
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${red}${(0.00125 * (petLevel - 100) + 0.125).toFixed(2)}% Damage${gray} for every million coins in your bank.`;
                },
                processEffect(profileState){
                    if (this.value === 0) this.value = profileState.bankBalance;
                    const pet = profileState.playerGear.pet;
                    const millions = Math.floor(this.value / 1000000);
                    const damageMulti = millions * (0.00125 * (pet.level - 100) + 0.125);
                    profileState.damageMultipliers.regularBaseMulti += damageMulti / 100;
                    profileState.damageMultipliers.magicBaseMulti += damageMulti / 100;
                },
            }
        ]
    },
    ENDERMAN: {
        baseStats: {},
        statsPerLevel: {
            CRITICAL_DAMAGE: 0.75
        },
        minRarity: 'COMMON',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Enderian',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.2,
                        RARE: 0.2,
                        EPIC: 0.3,
                        LEGENDARY: 0.3,
                        MYTHIC: 0.3
                    }
                    return `${gray}Take ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}less damage from end monsters.`;

                },
                'action': 'none'
            },
            {
                name: 'Teleport Savvy',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5,
                        MYTHIC: 0.5
                    }
                    return `${gray}Buffs the Transmission ability granting ${red}${formatValue(initialVal[tier] * petLevel)} Damage${gray} for 5s on use.`;
                },
                'action': 'addStatPerLevel',
                'stats': {
                    'DAMAGE': [
                        0,
                        0,
                        0.4,
                        0.5
                    ]
                }
            },
            {
                name: 'Zealot Madness',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases your odds to find a special Zealot by ${green}${formatValue(0.25 * petLevel)}%.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Enderman Slayer',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${teal}${formatValue(0.4 * petLevel)}% ☯ Combat Wisdom${gray} against Endermen.`;
                },
                'action': 'none'
            }
        ]
    },
    GHOUL: {
        baseStats: {},
        statsPerLevel: {
            FEROCITY: 0.05,
            HEALTH: 1,
            INTELLIGENCE: 0.75
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Amplified Healing',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${darkRed}+${formatValue(0.25 * petLevel)}♨ Vitality${gray}, which increases your incoming healing.`;
                },
                'action': 'none'
            },
            {
                name: 'Zombie Arm',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Increases the health and range of the Zombie Sword by ${green}${formatValue(0.5 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Reaper Soul',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases the health and lifespan of the Reaper Scythe zombies by ${green}${formatValue(1 * petLevel)}%.`;
                },
                'action': 'none'
            }
        ]
    },
    GOLEM: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1.5,
            STRENGTH: 0.5
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Last Stand',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}While less than 25% HP, deal ${green}${formatValue(0.3 * petLevel)}% ${gray}more damage.`;
                },
                'action': 'baseMultiplierPerLevel',
                'amountPerLevel': [
                    0.3
                ]
            },
            {
                name: 'Ricochet',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.2,
                        LEGENDARY: 0.25
                    }
                    return `${gray}Your iron plating causes ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}of attacks to ricochet and hit the attacker.`;
                },
                'action': 'none'
            },
            {
                name: 'Toss',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Every 5 hits, throw the enemy up into the air and deal ${green}${formatValue(200 + (3 * petLevel))}% ${gray}damage (10s cooldown).`;
                },
                'action': 'petAbility',
                'baseAmount': [
                    203
                ],
                'amountPerLevel': [
                    3
                ]
            }
        ]
    },
    'GRANDMA WOLF': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.25,
            HEALTH: 1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Kill Combo',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Gain buffs for combo kills. Effects stack as you increase your combo.`
                },
            }
        ]
    },
    GRIFFIN: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.25,
            CRITICAL_DAMAGE: 0.5,
            INTELLIGENCE: 0.1,
            MAGIC_FIND: 0.1,
            CRITICAL_CHANCE: 0.1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Odyssey',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Mythological creatures you find and burrows you dig scale in difficulty and rewards based on your equipped Griffin\'s rarity.`
                },
                'action': 'none'
            },
            {
                name: 'Legendary Constitution',
                minRarity: 'UNCOMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        UNCOMMON: { REGEN: 'V', STRENGTH: 'VII' },
                        RARE: { REGEN: 'VI', STRENGTH: 'VII' },
                        EPIC: { REGEN: 'VI', STRENGTH: 'VIII' },
                        LEGENDARY: { REGEN: 'VII', STRENGTH: 'VIII' },
                    }
                    return `${gray}Permanent ${red}Regeneration ${initialVal[tier].REGEN}${gray} and ${darkRed}Regeneration ${initialVal[tier].STRENGTH}${gray}.`;
                },
                'action': 'none'
            },
            {
                name: 'Perpetual Empathy',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.16,
                        LEGENDARY: 0.2
                    }
                    return `${gray}Heal nearby players for ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}of the final damage you receive. Excludes other griffins.`;
                },
                'action': 'none'
            },
            {
                name: 'King of Kings',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${red}+${formatValue(1 + (0.14 * petLevel))}% ❁Strength ${gray}when above ${red}85% ${gray}health.`;
                },
                resultType: 'globalMultiplier-multi',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 1 + (0.14 * petLevel);
                    return {
                        STRENGTH: 1 + (value / 100)
                    }
                }
            }
        ]
    },
    HORSE: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 0.5,
            WALK_SPEED: 0.25
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Rideable',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Right-click your summoned pet to ride it!`
                },
                'action': 'none'
            },
            {
                name: 'Run',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 1.1,
                        EPIC: 1.2,
                        LEGENDARY: 1.2,
                    }
                    return `${gray}Increases the speed of your mount by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Ride Into Battle',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}While riding your horse, gain ${green}${formatValue(0.25 * petLevel)}% ${gray}bow damage.`;
                },
                'action': 'buffBowDamage',
                'amountPerLevel': [
                    0.25
                ]
            }
        ]
    },
    HOUND: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.4,
            FEROCITY: 0.05,
            ATTACK_SPEED: 0.15
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Scavenger',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${orange}+${formatValue(0.05 * petLevel)} ${gray}per monster kill.`;
                },
                'action': 'none'
            },
            {
                name: 'Finder',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Increases the chance for monsters to drop their armor by ${green}${formatValue(0.1 * petLevel)}%${gray}.`;
                },
                'action': 'none'
            },
            {
                name: 'Fury Claws',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${green}${formatValue(0.1 * petLevel)}%${gray} ${yellow}⚔ Bonus Attack Speed.${gray}`;
                },
                resultType: 'globalMultiplier-multi',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.1 * petLevel;
                    return {
                        ATTACK_SPEED: 1 + (value / 100)
                    }
                }
            }
        ]
    },
    JERRY: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: -1.0
        },
        minRarity: 'COMMON',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Jerry',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}50% ${gray}chance to deal your regular damage.`;
                },
                'action': 'none'
            },
            {
                name: 'Jerry',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}100% ${gray}chance to receive a normal amount of drops from mobs.`;
                },
                'action': 'none'
            },
            {
                name: 'Jerry',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        LEGENDARY: 0.1,
                        MYTHIC: 0.5
                    }
                    return `${gray}Actually adds ${red}${formatValue(initialVal[tier] * petLevel)} Damage${gray} to the Aspect of the Jerry.`;

                },
                'action': 'none'
            },
            {
                resultType: 'buffWeapon',
                condition: {
                    requirement: 'weapon',
                    validParameters: ['ASPECT_OF_THE_JERRY']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        LEGENDARY: 0.1,
                        MYTHIC: 0.5
                    }
                    return {
                        DAMAGE: stats[tier] ? stats[tier] * petLevel : stats.MYTHIC * petLevel
                    }
                },
                name: 'Jerry',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${gray}Tiny chance to find Jerry Candies when killing mobs.`
                },
            }
        ]
    },
    KUUDRA: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.4,
            HEALTH: 4
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Crimson',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.15,
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.2,
                    }
                    return `${gray}Grants ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}extra crimson essence.`;

                },
                'action': 'none'
            },
            {
                name: 'Wither Bait',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.2,
                    }
                    return `${gray}Increases the odds of finding a Vanquisher by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Kuudra Fortune',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${orange}+${formatValue(0.5 * petLevel)}☘ Mining Fortune ${gray}while on the Crimson Isle.`;
                },
                'action': 'none'
            },
            {
                name: 'Trophy Bait',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Increases the odds of fishing Trophy Fish by ${green}${formatValue(0.2 * petLevel)}%.`;
                },
                'action': 'buffMobType',
                'mobType': 'Kuudra',
                'percentageAmount': 5
            },
            {
                name: 'Kuudra Specialist',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases all damage to Kuudra by ${red}5%.`;
                },
                'action': 'buffMobType',
                'mobType': 'Kuudra',
                'percentageAmount': 5
            }
        ]
    },
    'MAGMA CUBE': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.2,
            HEALTH: 0.5,
            DEFENSE: 0.333
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Slimy Minions',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.2,
                        UNCOMMON: 0.2,
                        RARE: 0.25,
                        EPIC: 0.3,
                        LEGENDARY: 0.3,
                    }
                    return `${gray}Slime minions work ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}faster while on your island.`;
                },
                'action': 'none'
            },
            {
                minRarity: 'RARE',
                resultType: 'postMultiplier',
                condition: {
                    requirement: 'targetMob',
                    validParameters: ['Slimes']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const amount = {
                        RARE: 0.2,
                        EPIC: 0.25,
                        LEGENDARY: 0.25,
                    }
                    const value = amount[tier] ? amount[tier] * petLevel : amount.LEGENDARY * petLevel;
                    return 1 + (value / 100);
                },
                name: 'Salt Blade',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.2,
                        EPIC: 0.25,
                        LEGENDARY: 0.25,
                    }
                    return `${gray}Deal ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}more damage to slimes.`;
                },
            },
            {
                minRarity: 'LEGENDARY',
                resultType: 'armorStatsBuff',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.5 * petLevel;
                    return {
                        armorKeyword: 'REKINDLED_EMBER',
                        percentage: 1 + (value / 100)
                    }
                },
                name: 'Hot Ember',
                description: (petLevel, tier) => {
                    return `${gray}Buffs the stats of Rekindled Ember Armor by ${green}${formatValue(0.5 * petLevel)}%${gray}`;
                },
            }
        ]
    },
    PHOENIX: {
        baseStats: {
            STRENGTH: 10,
            INTELLIGENCE: 50
        },
        statsPerLevel: {
            STRENGTH: 0.5,
            INTELLIGENCE: 1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Rekindle',
                minRarity: 'EPIC',
                resultType: 'basicStats',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        EPIC: 0.1,
                        LEGENDARY: 0.15
                    }
                    return {
                        STRENGTH: petLevel * stats[tier]
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.1,
                        LEGENDARY: 0.15
                    }
                    return `${gray}Before death, become immune and gain ${red}${formatValue(15 + initialVal[tier] * petLevel)} Strength ${gray} for ${green}${(0.02 * petLevel).toFixed(2)} seconds 
                            ${gray}1 minute cooldown.`;
                },
                'action': 'none'
            },
            {
                name: 'Fourth Flare',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: { crit: 0.12, time: 0.02 },
                        LEGENDARY: { crit: 0.14, time: 0.03 },
                    }
                    return `${gray}On 4th melee strike, ignite mobs, dealing ${red}${formatValue(1 + initialVal[tier].crit * petLevel)}x ${gray}your ${blue}Crit Damage ${gray} each
                            ${gray}second for ${green}${formatValue(initialVal[tier].time * petLevel)} ${gray}seconds.`;
                },
                'action': 'petAbility'
            },
            {
                name: 'Magic Bird',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}You may always fly on your Private Island.`
                },
                'action': 'none'
            },
            {
                name: 'Eternal Coins',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Don\'t lose coins from death.`
                },
                'action': 'none'
            }
        ]
    },
    PIGMAN: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            FEROCITY: 0.05,
            DEFENSE: 0.5
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Bacon Farmer',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Pig minions work ${green}${formatValue(0.3 * petLevel)}% ${gray}faster while on your island.`;
                },
                'action': 'none'
            },
            {
                resultType: 'buffWeapon',
                condition: {
                    requirement: 'weapon',
                    validParameters: ['PIGMAN_SWORD']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        DAMAGE: 0.4 * petLevel,
                        STRENGTH: 0.25 * petLevel
                    }
                },
                name: 'Pork Master',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Pig minions work ${green}${formatValue(0.3 * petLevel)}% ${gray}faster while on your island.`;
                },
            },
            {
                name: 'Giant Slayer',
                minRarity: 'LEGENDARY',
                resultType: 'baseMultiplier',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.25 * petLevel;
                    return (value / 100);
                },
                description: (petLevel, tier) => {
                    return `${gray}Deal ${green}${formatValue(0.25 * petLevel)}% ${gray}extra damage to monsters level 100 and up.`;
                },
                'action': 'baseMultiplierPerLevel',
                'amountPerLevel': [
                    0.25
                ]
            }
        ]
    },
    RAT: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            CRITICAL_DAMAGE: 0.1,
            HEALTH: 1
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Morph',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Right-click your summoned pet to morph into it!`;
                },
                'action': 'none'
            },
            {
                name: 'CHEESE!',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}As a Rat, you smell ${yellow}CHEESE ${gray}nearby! Yummy!`;
                },
                'action': 'none'
            },
            {
                name: 'Rat\'s Blessing',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Has a chance to grant a random player ${lightBlue}${(2 + 0.05 * petLevel)}${gray} for ${green}${(20 + 0.4 * petLevel)}
                            ${gray}seconds after finding a yummy piece of Cheese! 
                            ${gray} If the player gets a drop during this buff, you have a ${green}20%${gray}.`;
                },
                'action': 'none'
            },
            {
                name: 'Extreme Speed',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${gray}The Rat is TWO times faster.`;
                },
                'action': 'none'
            }
        ]
    },
    'SKELETON HORSE': {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            WALK_SPEED: 0.5
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Rideable',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Right-click your summoned pet to ride it!`;
                },
                'action': 'none'
            },
            {
                name: 'Run',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases the speed of your mount by ${green}${formatValue(1.5 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Ride Into Battle',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}While riding your horse, gain ${green}+${formatValue(0.4 * petLevel)}%${gray} bow damage.`;
                },
                'action': 'buffBowDamage',
                'amountPerLevel': [
                    0.4
                ]
            }
        ]
    },
    SNOWMAN: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.25,
            CRITICAL_DAMAGE: 0.25,
            DAMAGE: 0.25
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Blizzard',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Slow all enemies within ${green}${formatValue(4 + 0.04 * petLevel)}${gray} blocks.`;
                },
                'action': 'none'
            },
            {
                name: 'Frostbite',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Your freezing aura slows enemy attacks causing you to take ${green}${formatValue(0.15 * petLevel)}%${gray} reduced damage.`;
                },
                'action': 'none'
            },
            {
                name: 'Snow Cannon',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Your snowman fires a snowball dealing ${green}5x${gray} your ${red}Strength${gray} when a mob gets close to you. (1s cooldown)`;
                },
                'action': 'none'
            }
        ]
    },
    SKELETON: {
        baseStats: {},
        statsPerLevel: {
            CRITICAL_CHANCE: 0.15,
            CRITICAL_DAMAGE: 0.3
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Bone Arrows',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.15,
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.2,
                    }
                    return `${gray}Increase arrow damage by ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} which is tripled while in Dungeons.`;
                },
                'action': 'buffArrowDamage'
            },
            {
                name: 'Combo',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.15,
                        EPIC: 0.17,
                        LEGENDARY: 0.3,
                    }
                    return `${gray}Gain a combo stack for every bow hit granting ${red}+3 Strength${gray} 
                            ${gray}Max ${green}${formatValue(initialVal[tier] * petLevel)}${gray} stacks, stacks disappear after ${green}8${gray} seconds.`;
                },
                'action': 'none'
            },
            {
                name: 'Skeletal Defense',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Your skeleton shoots an arrow dealing ${green}30x${gray} your ${blue}Crit Damage${gray} when a mob gets close to you (5s cooldown).`;
                },
                'action': 'none'
            }
        ]
    },
    SPIDER: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.1,
            CRITICAL_CHANCE: 0.1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'One With the Spider',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${red}${(0.1 * petLevel)} Strength${gray} for every nearby spider. (max 10 spiders).`;
                },
                'action': 'none'
            },
            {
                name: 'Web-Weaver',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    return `${gray}Upon hitting a monster it becomes slowed by ${green}${formatValue(0.4 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Spider Whisperer',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Spider and tarantula minions work ${green}${formatValue(0.3 * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            }
        ]
    },
    SPIRIT: {
        baseStats: {},
        statsPerLevel: {
            WALK_SPEED: 0.3,
            INTELLIGENCE: 1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Spirit Assistance ',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Spawns and assists you when you are ghost in dungeons.`;
                },
                'action': 'none'
            },
            {
                name: 'Spirit Cooldowns',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Reduces the cooldown of your ghost abilities in dungeons by ${green}${formatValue(5 + 0.45 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Half Life',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}If you are the first player to die in a dungeon, the score penalty for that death is reduced to ${green}1.`;
                },
                'action': 'none'
            }
        ]
    },
    TARANTULA: {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.1,
            CRITICAL_CHANCE: 0.1,
            CRITICAL_DAMAGE: 0.3
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Webbed Cells',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Anti-healing is ${green}${formatValue(0.3 * petLevel)}%${gray} less effective against you.`;
                },
                'action': 'none'
            },
            {
                name: 'Eight Legs',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Decreases the Mana Cost of Spider, Tarantula and Spirit Boots boots by ${green}${formatValue(0.5 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Arachnid Slayer',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${green}${formatValue(0.5 * petLevel)}% ${teal}☯ Combat Wisdom${gray} against Spiders.`;
                },
                'action': 'none'
            }
        ]
    },
    TURTLE: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 0.1,
            DEFENSE: 1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'globalMultiplier-add',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 3 + (0.27 * petLevel);
                    return {
                        DEFENSE: (value / 100)
                    }
                },
                name: 'Turtle Tactics',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}${formatValue(3 + 0.27 * petLevel)}% Defense.${gray}`;
                },
            },
            {
                name: 'Genius Amniote',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}${formatValue(5 + 0.25 * petLevel)} Defense.${gray} for every player around you, up to 4 nearby players.`;
                },
                'action': 'none'
            },
            {
                name: 'Unflippable',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain immunity to knockback.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Turtle Shell',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}When under ${red}33%${gray} maximum HP, you take ${green}${formatValue(0.25 * petLevel)}%${gray} less damage.`;
                },
                'action': 'none'
            }
        ]
    },
    WOLF: {
        baseStats: {},
        statsPerLevel: {
            TRUE_DEFENSE: 0.1,
            CRITICAL_DAMAGE: 0.1,
            HEALTH: 0.5,
            WALK_SPEED: 0.2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Alpha Dog',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.2,
                        RARE: 0.2,
                        EPIC: 0.3,
                        LEGENDARY: 0.3,
                    }
                    return `${gray}Take ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} less damage from wolves.`;
                },
                'action': 'none'
            },
            {
                name: 'Pack Leader',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.1,
                        EPIC: 0.15,
                        LEGENDARY: 0.15,
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}% ${blue}Crit Damage${gray} for every nearby wolf (max 10 wolves).`;
                },
                'action': 'none'
            },
            {
                name: 'Combat Wisdom Boost',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${teal}+${formatValue(0.3 * petLevel)}☯ Combat Wisdom.${gray}`;
                },
                'action': 'none'
            }
        ]
    },
    ZOMBIE: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1,
            CRITICAL_DAMAGE: 0.3
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Chomp',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Heal ${red}+${formatValue(0.25 * petLevel)} Health${gray} per Zombie kill.`;
                },
                'action': 'none'
            },
            {
                name: 'Rotten Blade',
                resultType: 'postMultiplier',
                condition: {
                    requirement: 'targetMob',
                    validParameters: ['Zombie']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const percentage = {
                        RARE: 0.20,
                        EPIC: 0.25,
                        LEGENDARY: 0.25,
                    }
                    const value = percentage[tier] * petLevel;
                    return 1 + (value / 100);
                },
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.2,
                        EPIC: 0.25,
                        LEGENDARY: 0.25,
                    }
                    return `${gray}Deal ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} more damage to zombies.`;
                },
            },
            {
                resultType: 'livingDead',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.2 * petLevel;
                    return {
                        percentage: value / 100
                    }
                },
                name: 'Living Dead',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases all undead armor sets by ${green}${formatValue(0.2 * petLevel)}%.${gray}`;
                },
            }
        ]
    },
    BEE: {
        baseStats: {
            STRENGTH: 5
        },
        statsPerLevel: {
            STRENGTH: 0.25,
            INTELLIGENCE: 0.5,
            WALK_SPEED: 0.1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Hive',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: { INTEL: 0.02, STRENGTH: 0.02 },
                        UNCOMMON: { INTEL: 0.04, STRENGTH: 0.04 },
                        RARE: { INTEL: 0.09, STRENGTH: 0.07 },
                        EPIC: { INTEL: 0.14, STRENGTH: 0.11 },
                        LEGENDARY: { INTEL: 0.19, STRENGTH: 0.14 },
                    }
                    return `${gray}Gain ${lightBlue}${formatValue(1 + initialVal[tier].INTEL * petLevel)} ✎Intelligence${gray} and ${red}${formatValue(1 + initialVal[tier].STRENGTH * petLevel)} ❁Strength${gray} for each nearby bee. (max 15 bees)`;
                },
                'action': 'none'
            },
            {
                name: 'Busy Buzz Buzz',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.5,
                        EPIC: 0.5,
                        LEGENDARY: 1,
                    }
                    return `${gray}Has ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} chance for flowers to drop an extra one`;

                },
                'action': 'none'
            },
            {
                name: 'Weaponized Honey',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}${formatValue(5 + 0.2 * petLevel)}${gray} of received damage as ${orange}Absorption.`;
                },
                'action': 'none'
            }
        ]
    },
    CHICKEN: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Light Feet',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.3,
                        UNCOMMON: 0.3,
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return `${gray}Reduces fall damage by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Eggstra',
                minRarity: 'RARE    ',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.8,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    return `${gray}Killing chickens has a ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} chance to drop an egg.`;
                },
                'action': 'none'
            },
            {
                name: 'Mighty Chickens',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Chicken Minions work ${green}${formatValue(0.3 * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            }
        ]
    },
    ELEPHANT: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1,
            INTELLIGENCE: 0.75
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'statPerStat',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const receiveAmount = {
                        COMMON: 0.15,
                        UNCOMMON: 0.15,
                        RARE: 0.15,
                        EPIC: 0.20,
                        LEGENDARY: 0.20,
                    }
                    const dependentAmount = 100;
                    return {
                        receiveStat: 'DEFENSE',
                        receivePer: receiveAmount[tier] ? receiveAmount[tier] * petLevel : receiveAmount.LEGENDARY * petLevel,
                        dependentStat: 'WALK_SPEED',
                        perDependent: dependentAmount
                    }
                },
                name: 'Stomp',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.15,
                        UNCOMMON: 0.15,
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.2
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}${gray} for every ${white}100 ✦ Speed.`;
                },
            },
            {
                resultType: 'statPerStat',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const receiveAmount = 0.01;
                    const dependentAmount = 10;
                    return {
                        receiveStat: 'HEALTH',
                        receivePer: receiveAmount * petLevel,
                        dependentStat: 'DEFENSE',
                        perDependent: dependentAmount
                    }
                },
                name: 'Walking Fortress',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${red}${formatValue(0.01 * petLevel)} Health${gray} for every ${green}10 Defense.${gray}`;
                },
            },
            {
                name: 'Trunk Efficiency',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${orange}+${formatValue(1.8 * petLevel)} Farming Fortune,${gray} which increases your chance for multiple drops.`;
                },
                'action': 'none'
            }
        ]
    },
    'MOOSHROOM COW': {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Efficient Mushrooms',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.2,
                        UNCOMMON: 0.2,
                        RARE: 0.3,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Mushroom and Mycelium minions work ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            },
            {
                name: 'Mushroom Eater',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    return `${gray}When Breaking crops, there is a ${green}${formatValue(1 * petLevel)}%${gray} chance that a mushroom will drop.`;
                },
                'action': 'none'
            },
            {
                name: 'Farming Strength',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${orange}+1 Farming Fortune${gray} per every ${red}${formatValue(40 - 0.2 * petLevel)} Strength.`;
                },
                'action': 'none'
            }
        ]
    },
    PIG: {
        baseStats: {},
        statsPerLevel: {
            WALK_SPEED: 0.25
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Ridable',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Right-click your summoned pet to ride it!`;
                },
                'action': 'none'
            },
            {
                name: 'Run',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.3,
                        UNCOMMON: 0.4,
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return `${gray}Increases the speed of your mount by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Sprint',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return `${gray}While holding an Enchanted Carrot on a Stick, increase the speed of your mount by ${green}${formatValue(initialVal[tier] * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Trample',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}While on your private island, break all the crops your pig rides over.`;
                },
                'action': 'none'
            }
        ]
    },
    RABBIT: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1,
            WALK_SPEED: 0.2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Happy Feet',
                minRarity: 'COMMON',
                resultType: 'basicStats',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        COMMON: 0.3,
                        UNCOMMON: 0.4,
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return {
                        WALK_SPEED: stats[tier] * petLevel
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.3,
                        UNCOMMON: 0.4,
                        RARE: 0.4,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return `${gray}Jump potions also give ${green}+${formatValue(initialVal[tier] * petLevel)}${gray} ${white}✦ Speed.`;
                },
                'action': 'none'
            },
            {
                name: 'Farming Wisdom Boost',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.25,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Grants ${teal}${formatValue(initialVal[tier] * petLevel)} ☯ Farming Wisdom.`;
                },
                'action': 'none'
            },
            {
                name: 'Efficient Farming',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Farming minions work ${green}${formatValue(0.3 * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            }
        ]
    },
    ARMADILLO: {
        baseStats: {},
        statsPerLevel: {
            DEFENSE: 2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Ridable',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Right-click your summoned pet to ride it!`;
                },
                'action': 'none'
            },
            {
                name: 'Tunneller',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}The Armadillo breaks all stone or ore in its path while you are riding it in the Crystal Hollows.`;
                },
                'action': 'none'
            },
            {
                name: 'Earth Surfer',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}The Armadillo moves faster based on your Speed.`;
                },
                'action': 'none'
            },
            {
                name: 'Rolling Miner',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.2,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Every ${formatValue(60 - initialVal[tier] * petLevel)} seconds, the next gemstone you mine gives 2x drops.`;
                },
                'action': 'none'
            },
            {
                name: 'Mobile Tank',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}For every ${green}${formatValue(100 - 0.5 * petLevel)} ${gray}gain ${white}+1✦ Speed ${gray}and ${orange}+1 Mining Speed.`;
                },
                'action': 'none'
            }
        ]
    },
    BAT: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            WALK_SPEED: 0.05
        },
        minRarity: 'COMMON',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Candy Lover',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.15,
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.2,
                        MYTHIC: 0.2
                    }
                    return `${gray}Increases drop chance of candies from mobs by ${green}${formatValue(initialVal[tier] * petLevel)}%`;
                },
                'action': 'none'
            },
            {
                name: 'Nightmare',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: { INTEL: 0.2, SPEED: 0.4 },
                        EPIC: { INTEL: 0.3, SPEED: 0.5 },
                        LEGENDARY: { INTEL: 0.3, SPEED: 0.5 },
                        MYTHIC: { INTEL: 0.3, SPEED: 0.5 },
                    }
                    return `${gray}During night, gain ${green}${formatValue(initialVal[tier].INTEL * petLevel)}${lightBlue} Intelligence, ${green}${formatValue(initialVal[tier].SPEED * petLevel)}${white} ✦Speed${gray}, and Night Vision.`;
                },
                'action': 'addStatPerLevel',
                'stats': {
                    'INTELLIGENCE': [
                        { INTEL: 0.2, SPEED: 0.4 },
                        0.2,
                        0.3
                    ],
                    'WALK_SPEED': [
                        0.4,
                        0.4,
                        0.5
                    ]
                }
            },
            {
                name: 'Wings of Steel',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Deal ${green}${formatValue(0.5 * petLevel)}%${gray} damage to Spooky enemies during the Spooky Festival.`;
                },
                'action': 'none'
            },
            {
                name: 'Sonar',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${green}+${formatValue(0.25 * petLevel)}% ${gray}chance to fish up spooky sea creatures`;

                },
                'action': 'none'
            }
        ]
    },
    ENDERMITE: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1
        },
        minRarity: 'COMMON',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'More Stonks',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.5,
                        UNCOMMON: 0.75,
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1,
                        MYTHIC: 1
                    }
                    return `${gray}Gain more exp orbs for breaking end stone and gain a ${green}+${formatValue(initialVal[tier] * petLevel)}% ${gray}chance to get an extra block dropped.`;
                },
                'action': 'none'
            },
            {
                name: 'Daily Commuter',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.75,
                        EPIC: 0.1,
                        LEGENDARY: 0.1,
                        MYTHIC: 0.1
                    }
                    return `${blue}Transmission Abilities${gray} cost ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} less mana.`;
                },
                'action': 'none'
            },
            {
                name: 'Mite Bait',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain a ${green}${formatValue(0.03 * petLevel)}%${gray} chance to dig up a bonus ${red}Nest Endermite${gray} per ${magenta}+1 ♣ Pet Luck${gray}.`;
                },
                'action': 'none'
            },
            {
                name: 'Sacrificer',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${gray}Increases the odds of rolling for bonus items in the ${red}Draconic Altar${gray} by ${green}${formatValue(0.1 * petLevel)}%`;
                },
                'action': 'none'
            }
        ]
    },
    'MITHRIL GOLEM': {
        baseStats: {},
        statsPerLevel: {
            TRUE_DEFENSE: 0.5
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Mithril Affinity',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.5,
                        UNCOMMON: 0.75,
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1,
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}${orange} Mining Speed${gray} when mining ${yellow}Mithril`;
                },
                'action': 'none'
            },
            {
                name: 'The Smell Of Powder',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.1,
                        EPIC: 0.2,
                        LEGENDARY: 0.2
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} more ${darkGreen}Mithril Powder${gray} while mining.`;
                },
                'action': 'none'
            },
            {
                resultType: 'combatMulti',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = (0.2 * petLevel);
                    return {
                        percentage: 1 + (value / 100)
                    }
                },
                name: 'Danger Averse',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases your combat stats by ${green}${formatValue(0.2 * petLevel)}%${gray} on mining islands.`;
                },
            }
        ]
    },
    ROCK: {
        baseStats: {},
        statsPerLevel: {
            TRUE_DEFENSE: 0.1,
            DEFENSE: 2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Rideable',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Right-click on your summoned pet to ride it!`;
                },
                'action': 'none'
            },
            {
                name: 'Sailing Stone',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    return `${gray}Sneak to move your rock to your location (15s cooldown)`;
                },
                'action': 'none'
            },
            {
                resultType: 'rockDefense',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const baseIncrease = {
                        RARE: 0.2,
                        EPIC: 0.25,
                        LEGENDARY: 0.25,
                    }
                    const value = baseIncrease[tier] ? baseIncrease[tier] * petLevel : baseIncrease.LEGENDARY * petLevel;
                    return {
                        percentage: (value / 100)
                    }
                },
                name: 'Fortify',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.3,
                        EPIC: 0.25,
                        LEGENDARY: 0.25
                    }
                    return `${gray}While sitting on your rock, gain ${green}+${formatValue(initialVal[tier] * petLevel)}% ❈Defense`;
                },
            },
            {
                resultType: 'postMultiplier',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.3 * petLevel;
                    return 1 + (value / 100);
                },
                name: 'Steady Ground',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}While sitting on your rock, gain ${green}+${formatValue(0.3 * petLevel)}%${red} ❁Damage`;
                },
            }
        ]
    },
    SCATHA: {
        baseStats: {},
        statsPerLevel: {
            DEFENSE: 1
        },
        minRarity: 'RARE',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Grounded',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 1,
                        EPIC: 1.25,
                        LEGENDARY: 1.25
                    }
                    return `${gray}Gain ${orange}+${formatValue(initialVal[tier] * petLevel)} ☘ Mining Fortune.`;
                },
                'action': 'none'
            },
            {
                name: 'Burrowing',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.025,
                        EPIC: 0.03,
                        LEGENDARY: 0.03
                    }
                    return `${gray}When mining, there is a ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} chance to mine up a treasure burrow.`;
                },
                'action': 'none'
            },
            {
                name: 'Wormhole',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gives a ${green}${formatValue(1 * petLevel)}%${gray} chance to mine 2 adjacent stone or hard stone.`;
                },
                'action': 'none'
            },
            {
                name: 'Gemstone Power',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${green}${formatValue(0.2 * petLevel)}%${gray} more Gemstone Powder.`;
                },
                'action': 'none'
            }
        ]
    },
    SILVERFISH: {
        baseStats: {},
        statsPerLevel: {
            DEFENSE: 1,
            HEALTH: 0.2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'basicStats',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        COMMON: 0.05,
                        UNCOMMON: 0.1,
                        RARE: 0.1,
                        EPIC: 0.15,
                        LEGENDARY: 0.15
                    }
                    return {
                        TRUE_DEFENSE: stats[tier] ? stats[tier] * petLevel : stats.LEGENDARY * petLevel
                    }
                },
                name: 'True Defense Boost',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.05,
                        UNCOMMON: 0.1,
                        RARE: 1,
                        EPIC: 0.15,
                        LEGENDARY: 0.15
                    }
                    return `${gray}Boosts your ${white}❂True Defense${gray} by ${green}${formatValue(initialVal[tier] * petLevel)}`;
                },
            },
            {
                name: 'Mining Wisdom Boost',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.25,
                        EPIC: 0.3,
                        LEGENDARY: 0.3,
                    }
                    return `${gray}Grants ${teal}+${formatValue(initialVal[tier] * petLevel)} ☯Mining Wisdom.`;
                },
                'action': 'none'
            },
            {
                name: 'Dexterity',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gives permanent haste III.`;
                },
                'action': 'none'
            }
        ]
    },
    SNAIL: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Red Sand Enjoyer',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.2,
                        RARE: 0.3,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Red Sand minions work ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            },
            {
                name: 'Slow Moving',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.3,
                        EPIC: 0.5,
                        LEGENDARY: 0.5
                    }
                    return `${gray}Converts all ${white}✦ Speed${gray} over 100 into ${orange}☘ Mining Fortune${gray} for Non-Ores at ${green}${formatValue(initialVal[tier] * petLevel)}% ${gray}efficiency.`;
                },
                'action': 'none'
            },
            {
                name: 'Slow But Efficient',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Reduces the mana cost of ${blue}Utility Abilities ${gray}by ${green}${formatValue(0.01 * petLevel)}% ${gray}for every 15 ${white}✦ Speed ${gray}converted`;

                },
                'action': 'none'
            }
        ]
    },
    'WITHER SKELETON': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.25,
            CRITICAL_DAMAGE: 0.25,
            DEFENSE: 0.25,
            CRITICAL_CHANCE: 0.05,
            INTELLIGENCE: 0.25
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Stronger Bones',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Take ${green}${formatValue(0.3 * petLevel)}%${gray} less damage from Skeletons`;
                },
                'action': 'none'
            },
            {

                resultType: 'postMultiplier',
                condition: {
                    requirement: 'targetMob',
                    validParameters: ['Wither']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.25 * petLevel;
                    return 1 + (value / 100);
                },
                name: 'Wither Blood',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Deal ${green}${formatValue(0.25 * petLevel)}%${gray} more damage against wither mobs`;
                },
            },
            {
                name: 'Death\'s Touch',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Upon hitting an enemy inflict the wither effect for ${green}${formatValue(2 * petLevel)}%${gray} damage over 3 seconds. Does not stack`;
                },
                'action': 'petAbility'
            }
        ]
    },
    GIRAFFE: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1,
            CRITICAL_CHANCE: 0.05
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Good Heart',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.05,
                        UNCOMMON: 0.1,
                        RARE: 0.15,
                        EPIC: 0.2,
                        LEGENDARY: 0.25
                    }
                    return `${gray}Regen ${red}${formatValue(initialVal[tier] * petLevel)} ❤Health ${gray}per second.`;
                },
                'action': 'none'
            },
            {
                name: 'Higher Ground',
                minRarity: 'RARE',
                enabled: false,
                resultType: 'basicStats',
                effectResults: (petLevel, tier) => {
                    const stats = {
                        RARE: { strength: 0.4, crit: 0.1 },
                        EPIC: { strength: 0.5, crit: 0.25 },
                        LEGENDARY: { strength: 0.5, crit: 0.4 }
                    }
                    return {
                        STRENGTH: petLevel * stats[tier].strength,
                        CRITICAL_DAMAGE: petLevel * stats[tier].crit,
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: { strength: 0.4, crit: 0.1 },
                        EPIC: { strength: 0.5, crit: 0.25 },
                        LEGENDARY: { strength: 0.5, crit: 0.4 }
                    }
                    return `${gray}Grants ${green}+${formatValue(initialVal[tier].strength * petLevel)}${red} ❁Strength${gray} and ${green}+${formatValue(initialVal[tier].crit * petLevel)}${blue} ☠Crit Damage ${gray}when mid air.`;
                },
                'action': 'addStatPerLevel',
                'stats': {
                    'STRENGTH': [
                        0.4,
                        0.4,
                        0.4,
                        0.5
                    ],
                    'CRITICAL_DAMAGE': [
                        0.1,
                        0.1,
                        0.1,
                        0.25,
                        0.4
                    ]
                }
            },
            {
                name: 'Long Neck',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}See enemies from afar and gain ${green}${formatValue(0.25 * petLevel)}% ${gray}dodge chance.`;
                },
                'action': 'none'
            }
        ]
    },
    MONKEY: {
        baseStats: {},
        statsPerLevel: {
            WALK_SPEED: 0.2,
            INTELLIGENCE: 0.5
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Treeborn',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.4,
                        UNCOMMON: 0.5,
                        RARE: 0.5,
                        EPIC: 0.6,
                        LEGENDARY: 0.6
                    }
                    return `${gray}Grants ${green}+${formatValue(initialVal[tier] * petLevel)}${orange} ☘Foraging Fortune,${gray} which increases your chances at double logs.`;
                },
                'action': 'none'
            },
            {
                name: 'Vine Swing',
                minRarity: 'RARE',
                resultType: 'basicStats',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    return {
                        WALK_SPEED: petLevel * stats[tier]
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    return `${gray}Increases ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} ${white}✦Speed${gray} while in The Park.`;
                },
                'action': 'addStatPerLevel',
                'stats': {
                    'WALK_SPEED': [
                        0.75,
                        0.75,
                        0.75,
                        1
                    ]
                }
            },
            {
                name: 'Evolves Axes',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Reduce the cooldown of Jungle Axe and Treecapitator by ${green}${formatValue(0.5 * petLevel)}%.`;
                },
                'action': 'none'
            }
        ]
    },
    OCELOT: {
        baseStats: {},
        statsPerLevel: {
            WALK_SPEED: 0.5,
            FEROCITY: 0.1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Foraging Wisdom Boost',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.2,
                        UNCOMMON: 0.25,
                        RARE: 0.25,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Grants ${teal}+${formatValue(initialVal[tier] * petLevel)} ☯Foraging Wisdom.`;
                },
                'action': 'none'
            },
            {
                name: 'Tree Hugger',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.3,
                        EPIC: 0.3,
                        LEGENDARY: 0.3
                    }
                    return `${gray}Foraging minions work ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} faster while on your island.`;
                },
                'action': 'none'
            },
            {
                name: 'Tree Essence',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases your ${green}${formatValue(0.3 * petLevel)}%${gray} chance to get exp from breaking a log.`;
                },
                'action': 'none'
            }
        ]
    },
    AMMONITE: {
        baseStats: {},
        statsPerLevel: {},
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Heart of the Sea',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${teal}${formatValue(0.1 * petLevel)}% Sea Creature Chance${gray} to your pet for each.`;
                },
                'action': 'none'
            },
            {
                name: 'Expert Cave Fisher',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}The fishing speed reduction from being underground is attenuated by ${green}${formatValue(1 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                resultType: 'statBasedOnSkill',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        MINING: {
                            WALK_SPEED: 0.02 * petLevel,
                            DEFENSE: 0.02 * petLevel
                        },
                        FISHING: {
                            WALK_SPEED: 0.02 * petLevel,
                            DEFENSE: 0.02 * petLevel
                        }
                    }
                },
                name: 'Gift of the Ammonite',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Each Mining and Fishing level grants ${lightBlue}+${formatValue((0.005 * petLevel))} ☂Fishing Speed,${white} +${formatValue((0.02 * petLevel))} ✦Speed${gray} and ${green}+${formatValue((0.02 * petLevel))} ❈Defense.`;
                },
            }
        ]
    },
    'BABY YETI': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.4,
            INTELLIGENCE: 0.75
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                resultType: 'basicStats',
                enabled: false,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        EPIC: {
                            STRENGTH: 0.5,
                            CRITICAL_DAMAGE: 0.5
                        },
                        LEGENDARY: {
                            STRENGTH: 0.5,
                            CRITICAL_DAMAGE: 0.5
                        },
                    }
                    return {
                        STRENGTH: stats[tier]?.STRENGTH ? stats[tier].STRENGTH * petLevel : stats.LEGENDARY.STRENGTH * petLevel,
                        CRITICAL_DAMAGE: stats[tier]?.CRITICAL_DAMAGE ? stats[tier].CRITICAL_DAMAGE * petLevel : stats.LEGENDARY.CRITICAL_DAMAGE * petLevel,
                    }
                },
                name: 'Cold Breeze',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Gives ${green}${formatValue((0.5 * petLevel))}${red} ❁ Strength${gray} and ${blue}☠ Crit Damage${gray} when near snow.`;
                },
            },
            {
                resultType: 'IceShields',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const percentages = {
                        EPIC: 0.5,
                        LEGENDARY: 0.75,
                    }
                    return percentages[tier] ? percentages[tier] * petLevel : percentages.LEGENDARY * petLevel;
                },
                name: 'Ice Shields',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 0.5,
                        LEGENDARY: 0.75,
                    }
                    return `${gray}Gain ${green}${formatValue(initialVal[tier] * petLevel)}%${gray} of your ${red}strength ${gray}as ${green} ❈Defense.`;
                },
            },
            {
                resultType: 'buffWeapon',
                condition: {
                    requirement: 'weapon',
                    validParameters: ['YETI_SWORD']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    return {
                        DAMAGE: 1 * petLevel,
                        INTELLIGENCE: 1 * petLevel
                    }
                },
                name: 'Yeti Fury',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Buff the Yeti Sword by ${green}${formatValue((1 * petLevel))}${red} ❁Damage${gray} and ${lightBlue} ✎Intelligence.`;
                },
            }
        ]
    },
    BLUE_WHALE: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Ingest',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.5,
                        UNCOMMON: 1,
                        RARE: 1.5,
                        EPIC: 2,
                        LEGENDARY: 2
                    }
                    return `${gray}All potions heal ${red}+${formatValue(initialVal[tier] * petLevel)} ❤HP.`;
                },
                'action': 'none'
            },
            {
                resultType: 'statPerStat',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const dependentAmount = {
                        RARE: 30,
                        EPIC: 25,
                        LEGENDARY: 20,
                    }
                    const receiveAmount = 0.01 * petLevel;
                    return {
                        receiveStat: 'DEFENSE',
                        receivePer: receiveAmount,
                        dependentStat: 'HEALTH',
                        perDependent: dependentAmount[tier] ? dependentAmount[tier] : dependentAmount.LEGENDARY,
                    }
                },
                name: 'Bulk',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 30,
                        EPIC: 25,
                        LEGENDARY: 20,
                    }
                    return `${gray}Gain ${green}+${formatValue((0.01 * petLevel))} ❈Defense${gray} per ${red}${formatValue(initialVal[tier])} Max ❤Health.`;
                },
            },
            {
                resultType: 'globalMultiplier-add',
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.2 * petLevel;
                    return {
                        HEALTH: value / 100
                    };
                },
                name: 'Archimedes',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${red}+${formatValue((0.2 * petLevel))}% Max ❤Health.`;
                },
            }
        ]
    },
    DOLPHIN: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Pod Tactics',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.06,
                        UNCOMMON: 0.08,
                        RARE: 0.08,
                        EPIC: 0.1,
                        LEGENDARY: 0.1
                    }
                    return `${gray}Grants ${lightBlue}+${formatValue((initialVal[tier] * petLevel))}% ☂Fishing Speed${gray} for each player within ${green}30${gray} blocks, up to ${green}5${gray} players.`;
                },
                'action': 'none'
            },
            {
                name: 'Echolocation',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.07,
                        EPIC: 0.1,
                        LEGENDARY: 0.1
                    }
                    return `${gray}Grants ${teal}+${formatValue((initialVal[tier] * petLevel))}% Sea Creature Chance.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Splash Surprise',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Stun sea creatures for ${green}5s${gray} after fishing them up.`;
                },
                'action': 'none'
            }
        ]
    },
    'FLYING FISH': {
        baseStats: {},
        statsPerLevel: {
            STRENGTH: 0.5,
            DEFENSE: 0.5
        },
        minRarity: 'RARE',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Quick Reel',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.6,
                        EPIC: 0.75,
                        LEGENDARY: 0.8,
                        MYTHIC: 0.8
                    }
                    return `${gray}Grants ${lightBlue}+${formatValue((initialVal[tier] * petLevel))} ☂Fishing Speed.`;
                },
                'action': 'none'
            },
            {
                name: 'Water Bender',
                name2: { minRarity: 'MYTHIC', name: 'Lava Bender' },
                minRarity: 'RARE',
                enabled: false,
                resultType: 'basicStats',
                effectResults: (petLevel, tier) => {
                    const stats = {
                        RARE: 0.8,
                        EPIC: 1,
                        LEGENDARY: 1,
                        MYTHIC: 1
                    }
                    return {
                        STRENGTH: petLevel * stats[tier],
                        DEFENSE: petLevel * stats[tier],
                    }
                },
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.8,
                        EPIC: 1,
                        LEGENDARY: 1,
                        MYTHIC: 1
                    }
                    return `${gray}Gives ${green}${formatValue((initialVal[tier] * petLevel))}${red} ❁Strength${gray} and ${green}❈Defense${gray} when near ${tier === 'MYTHIC' ? 'Lava.' : 'Water.'}`;
                },
                'action': 'addStatPerLevel',
                'stats': {
                    'STRENGTH': [
                        0.8,
                        0.8,
                        0.8,
                        1
                    ],
                    'DEFENSE': [
                        0.8,
                        0.8,
                        0.8,
                        1
                    ]
                }
            },
            {
                resultType: 'armorStatsBuff',
                postEffect: true,
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const value = 0.2 * petLevel;
                    if (tier === 'LEGENDARY') {
                        return {
                            armorKeyword: 'DIVER',
                            percentage: 1 + (value / 100)
                        }
                    }
                    else if (tier === 'MYTHIC') {
                        return {
                            armorKeyword: 'MAGMA_LORD',
                            percentage: 1 + (value / 100)
                        }
                    }
                },
                name: 'Deep Sea Diver',
                name2: { minRarity: 'MYTHIC', name: 'Magmatic Diver' },
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases the stats of ${red}${tier === 'MYTHIC' ? 'Magma Lord Armor ' : 'Diver\'s Armor'} ${gray}by ${green}${formatValue((0.2 * petLevel))}%${gray}.`;
                },
            }
        ]
    },
    SQUID: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 0.5,
            INTELLIGENCE: 0.5
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'More Ink',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.5,
                        UNCOMMON: 0.75,
                        RARE: 0.75,
                        EPIC: 1,
                        LEGENDARY: 1
                    }
                    return `${gray}Gain a ${green}${formatValue((initialVal[tier] * petLevel))}%${gray} chance to get double drops from squids.`;
                },
                'action': 'none'
            },
            {
                resultType: 'buffWeapon',
                condition: {
                    requirement: 'weapon',
                    validParameters: ['INK_WAND']
                },
                enabled: true,
                effectResults: (petLevel, tier) => {
                    const stats = {
                        RARE: { DAMAGE: 0.3, STRENGTH: 0.1 },
                        EPIC: { DAMAGE: 0.4, STRENGTH: 0.2 },
                        LEGENDARY: { DAMAGE: 0.4, STRENGTH: 0.2 }
                    }
                    return {
                        DAMAGE: stats[tier].DAMAGE ? stats[tier].DAMAGE * petLevel : stats.LEGENDARY.DAMAGE * petLevel,
                        STRENGTH: stats[tier].STRENGTH ? stats[tier].STRENGTH * petLevel : stats.LEGENDARY.STRENGTH * petLevel
                    }
                },
                name: 'Ink Specialty',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: { strength: 0.1, damage: 0.3 },
                        EPIC: { strength: 0.2, damage: 0.4 },
                        LEGENDARY: { strength: 0.2, damage: 0.4 },
                    }
                    return `${gray}Buffs the Ink Wand by ${green}${formatValue(initialVal[tier].damage * petLevel)} ${red}❁Damage${gray} 
                            ${gray}and ${green}${formatValue(initialVal[tier].strength * petLevel)} ${red}❁Strength`;
                },
            },
            {
                name: 'Fishing Wisdom Boost',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants ${teal}+${formatValue((0.3 * petLevel))} ☯Fishing Wisdom.${gray}`;
                },
                'action': 'none'
            }
        ]
    },
    GUARDIAN: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            DEFENSE: 0.5
        },
        minRarity: 'COMMON',
        maxRarity: 'MYTHIC',
        abilities: [
            {
                name: 'Lazerbeam',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.02,
                        UNCOMMON: 0.06,
                        RARE: 0.1,
                        EPIC: 0.15,
                        LEGENDARY: 0.2,
                        MYTHIC: 1.2
                    }
                    return `${gray}Zaps your enemies for ${lightBlue}${formatValue((initialVal[tier] * petLevel))}x${gray} your${lightBlue} ✎Intelligence${gray} every ${green}3s.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Enchanting Wisdom Boost',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    const initialVal = {
                        RARE: 0.25,
                        EPIC: 0.3,
                        LEGENDARY: 0.3,
                        MYTHIC: 0.3
                    }
                    return `${gray}Grants ${teal}${formatValue((initialVal[tier] * petLevel))} ☯Enchanting Wisdom.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Mana Pool',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Regenerate ${lightBlue}${formatValue((0.3 * petLevel))}%${gray} extra ${lightBlue}✎Mana,${gray} doubled when near or in water.`;
                },
                'action': 'none'
            },
            {
                name: 'Lucky Seven',
                minRarity: 'MYTHIC',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${lightBlue}+${formatValue((0.07 * petLevel))}%${gray} chance to find ${purple}ultra rare${gray} books in ${magenta}SuperPairs.`;
                },
                'action': 'none'
            }
        ]
    },
    JELLYFISH: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 2
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Radiant Scyphozoa',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}While in dungeons, reduces the mana cost of Power Orbs by ${green}${formatValue(0.5 * petLevel)}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Stored Energy',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}While in dungeons, for every ${red}2,000 HP${gray} you heal teammates, the cooldown of ${green}Wish${gray} is reduced by ${green}${formatValue((0.01 * petLevel))}s${gray} up to ${green}30s.`;
                },
                'action': 'none'
            },
            {
                name: 'Powerful Potions',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}While in dungeons, increase the effectiveness of Dungeon Potions by ${green}${formatValue((0.5 * petLevel))}%.`;
                },
                'action': 'none'
            }
        ]
    },
    PARROT: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            CRITICAL_DAMAGE: 0.1
        },
        minRarity: 'EPIC',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Flamboyant',
                minRarity: 'EPIC',
                
                description: (petLevel, tier) => {
                    const initialVal = {
                        EPIC: 15,
                        LEGENDARY: 20
                    }
                    return `${gray}Adds ${green}${formatValue((((petLevel/100) * (initialVal[tier] - 1)) + 1))}${gray} level(s) to intimidation accessories.`;
                },
                'action': 'none'
            },
            {
                name: 'Repeat',
                minRarity: 'EPIC',
                description: (petLevel, tier) => {
                    return `${gray}Boosts potions duration by ${green}${formatValue((5 + 0.35 * petLevel))}%.`;
                },
                'action': 'none'
            },
            {
                name: 'Bird Discourse',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gives ${green}+${formatValue((5 + 0.25 * petLevel))}${red} ❁Strength${gray} to players within 20 Blocks (doesn't stack).`;
                },
                'action': 'none'
            },
            {
                name: 'Parrot Feather Infusion',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}When summoned or in your pets menu, boost the duration of consumed God Potions by ${green}+${formatValue((0.2 * petLevel))}%.`;
                },
                'action': 'none'
            }
        ]
    },
    SHEEP: {
        baseStats: {},
        statsPerLevel: {
            INTELLIGENCE: 1,
            ABILITY_DAMAGE_PERCENT: 0.2
        },
        minRarity: 'COMMON',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Mana Saver',
                minRarity: 'COMMON',
                description: (petLevel, tier) => {
                    const initialVal = {
                        COMMON: 0.1,
                        UNCOMMON: 0.1,
                        RARE: 0.1,
                        EPIC: 0.2,
                        LEGENDARY: 0.2
                    }
                    return `${gray}Reduces the ${lightBlue}✎Mana ${gray}cost of abilities by ${green}${formatValue(0.2 * petLevel)}`;
                },
                'action': 'none'
            },
            {
                name: 'Overheal',
                minRarity: 'RARE',
                description: (petLevel, tier) => {
                    return `${gray}Gives a ${green}+${formatValue((0.1 * petLevel))}%${gray} shield after not taking damage for ${green}10s.`;
                },
                'action': 'none'
            },
            {
                name: 'Dungeon Wizard',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Increases your total ${lightBlue}✎Mana ${gray}by ${green}+${formatValue((0.25 * petLevel))}%${gray} while in Dungeons.`;
                },
                'action': 'none'
            }
        ]
    },
    REINDEER: {
        baseStats: {},
        statsPerLevel: {
            HEALTH: 1
        },
        minRarity: 'LEGENDARY',
        maxRarity: 'LEGENDARY',
        abilities: [
            {
                name: 'Winter Spirit',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gain ${magenta}double${gray} pet ${green}EXP.`;
                },
                'action': 'none'
            },
            {
                name: 'Infused',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Gives ${lightBlue}+${formatValue((0.75 * petLevel))} ☂Fishing Speed ${gray}and ${teal}+10 Sea Creature Chance ${gray}while on ${red}Jerry's Workshop.`;
                },
                'action': 'none'
            },
            {
                name: 'Snow Power',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Grants Bonus gift chance during the ${red}Gift Attack${gray} event is ${green}${formatValue(0.1 * petLevel)}%.${gray}`;
                },
                'action': 'none'
            },
            {
                name: 'Icy Wind',
                minRarity: 'LEGENDARY',
                description: (petLevel, tier) => {
                    return `${gray}Chance of getting double ${lightBlue}Ice Essence${gray} is ${green}${formatValue(0.2 * petLevel)}%.`;
                },
                'action': 'none'
            }
        ]
    }
}

export const petList = () =>{
    const list =  Object.keys(pets).sort();
    list.unshift('Unequipped');
    return list;
};