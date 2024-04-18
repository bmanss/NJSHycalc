"use client";
import { useState } from "react";
import { rarityColor, armorStatColor, gemCutColor, loreColors } from "../constants/colors";
import { trackedStats, statAlias } from "../constants/trackedStats";
import { arrowList } from "../constants/arrows";
import { gemstoneSlots, gemstones } from "../constants/gemStones";
import InputCounter from "./InputCounter";
import SearchBox from "./SearchBox";
import { useProfileContext } from "../context/ProfileContext";
import { ProfileActions } from "../context/ProfileContext";
import { createGearPiece, changeGearPiece } from "../lib/ProfileFunctions";
import { parseLore } from "../lib/Util";
import Image from "next/image";
import styles from "../styles/ItemCard.module.scss";
import { formatStat, formatValue } from "../lib/Util";
const ItemCard = ({ itemList, gearPiece, reforgeList, enchantmentList, displayOnly }) => {
  const profileContext = useProfileContext();
  const [selectedEnchant, setSelectedEnchant] = useState(enchantmentList && enchantmentList[0]);
  const [enchantMaxLevels, setEnchantMaxLevels] = useState(selectedEnchant && selectedEnchant.maxLevels);
  const [selectedLevel, setSelectedLevel] = useState(1);

  const updateModifier = (geartype, modifierType, value) => {
    const updatedGear = profileContext.getGearPiece(geartype);
    updatedGear[modifierType] = value;
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_PLAYER_GEAR_PIECE, payload: { category: geartype, newGearPiece: updatedGear } });
  };

  const updateGem = (slotName, type, gem, cut) => {
    const updatedGems = {
      ...gearPiece.gemSlots,
      [slotName]: {
        type: type,
        gem: gem,
        cut: cut,
      },
    };
    updateModifier(gearPiece.category, "gemSlots", updatedGems);
  };

  const addEnchant = () => {
    const updatedEnchants = {
      ...gearPiece.enchantments,
      [selectedEnchant.name]: selectedLevel,
    };
    updateModifier(gearPiece.category, "enchantments", updatedEnchants);
  };
  const removeEnchant = () => {
    if (selectedEnchant.name in gearPiece.enchantments) {
      const updatedEnchants = {
        ...gearPiece.enchantments,
      };
      delete updatedEnchants[selectedEnchant.name];
      updateModifier(gearPiece.category, "enchantments", updatedEnchants);
    }
  };
  const clearEnchant = () => {
    updateModifier(gearPiece.category, "enchantments", {});
  };

  const handleEnchantChange = (value) => {
    setSelectedEnchant(value);
    setEnchantMaxLevels(value.maxLevels);
    setSelectedLevel(1);
  };
  const handleGearChange = (category, newID) => {
    const newGearPiece = createGearPiece(profileContext.getGearPiece(category), newID, category);
    const referenceData = profileContext.getHypixelItem(category, newID);
    changeGearPiece(profileContext.getGearPiece(category), newGearPiece, referenceData);
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_PLAYER_GEAR_PIECE, payload: { category: category, newGearPiece: newGearPiece } });
  };

  const toggleEffect = (effectIndex) => {
    gearPiece.effects[effectIndex].enabled = !gearPiece.effects[effectIndex].enabled;
    profileContext.dispatchProfileUpdate({
      type: ProfileActions.SET_PLAYER_GEAR_PIECE,
      payload: { category: gearPiece.category, newGearPiece: gearPiece },
    });
  };

  return (
    <div className={styles["itemCard"]} style={{ border: `2px solid ${rarityColor[gearPiece.tier]}` }}>
      <span className='minecraft-text'>{gearPiece.category ?? ""}</span>
      <div className='flex-column'>
        <div className='flex-column'>
          {/* Stars Visual*/}
          {gearPiece.itemType !== "normal" && (
            <span style={{ height: "15px", display: "flex", alignItems: "center" }}>
              {[...Array(Math.min(gearPiece.starLevel, 5))].map((_, index) =>
                gearPiece.starLevel > 0 && gearPiece.starLevel - index > 5 ? (
                  <span className='minecraft-text' style={{ fontSize: "20px", color: "#fc66ff" }} key={index}>
                    ✪
                  </span>
                ) : (
                  <span className='minecraft-text' style={{ fontSize: "20px", color: "#ffc908" }} key={index}>
                    ✪
                  </span>
                )
              )}
            </span>
          )}
          {/* Item list */}
          {itemList ? (
            <SearchBox
              recombob={gearPiece.rarityUpgrades}
              itemList={itemList}
              selectedItem={gearPiece}
              onItemChange={(value) => handleGearChange(gearPiece.category, value)}
            />
          ) : (
            <span style={{ padding: "3px 0", color: rarityColor[gearPiece.tier] ?? "white" }}>{gearPiece.name}</span>
          )}

          {/* Arrow list if bow */}
          {gearPiece.referenceCategory === "bow" && (
            <span style={{ display: "flex", alignItems: "center" }}>
              <span className={styles["ItemCard-properties"]} style={{ marginBottom: "3px", marginRight: "5px", marginLeft: "5px" }}>
                Arrow:{" "}
              </span>
              <SearchBox
                itemList={arrowList()}
                selectedItem={gearPiece.arrow}
                onItemChange={(value) => updateModifier(gearPiece.category, "arrow", value)}
              />
            </span>
          )}
        </div>
        {/* Reforges */}
        <div className={styles["ItemCard-properties"]} style={{ marginLeft: "5px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className={styles["ItemCard-stat"]}>Reforge:</span>
            <SearchBox
              itemList={reforgeList}
              placeholder={"Select Reforge"}
              selectedItem={gearPiece.modifier}
              onItemChange={(e) => updateModifier(gearPiece.category, "modifier", e)}
            />
          </div>
          {/* recombob */}
          <div className='flex-row' style={{ alignItems: "center" }}>
            <span>Recombobulated</span>
            <input
              className='checkBox'
              type='checkbox'
              checked={gearPiece.rarityUpgrades ?? false}
              value={gearPiece.rarityUpgrades}
              onChange={(e) => updateModifier(gearPiece.category, "rarityUpgrades", !gearPiece.rarityUpgrades)}
            />
          </div>
          {/* stars */}
          {gearPiece.itemType !== "normal" && (
            <div className='flex-row' style={{ alignItems: "center" }}>
              <span style={{ marginRight: "5px", paddingTop: "5px" }}>Stars: </span>
              <InputCounter
                value={gearPiece.starLevel}
                isStatic={displayOnly ? true : false}
                min={0}
                max={10}
                onChange={(value) => updateModifier(gearPiece.category, "starLevel", value)}
              />
            </div>
          )}
          {/* books */}
          {gearPiece.generalCategory !== "equipment" && (
            <div className='flex-row ' style={{ alignItems: "center" }}>
              <span style={{ marginRight: "5px", paddingTop: "5px" }}>Books: </span>
              <InputCounter
                value={gearPiece.hotPotatoCount}
                isStatic={displayOnly ? true : false}
                min={0}
                max={15}
                onChange={(value) => updateModifier(gearPiece.category, "hotPotatoCount", value)}
              />
            </div>
          )}
          {/* stats */}
          {gearPiece.nonDungeonStats &&
            Object.entries(gearPiece.nonDungeonStats).map(
              ([stat, value]) =>
                value !== undefined &&
                value !== 0 && (
                  <div key={stat} className='flex-row'>
                    <span className={styles["ItemCard-stat"]}>{statAlias[stat] ? statAlias[stat] : formatStat(stat)}: </span>
                    <span style={{ color: armorStatColor[stat] ?? "#00ff1a", marginRight: "5px" }}>{formatValue(value.toFixed(2))}</span>
                    {/* potato books stats */}
                    {stat === "HEALTH" && gearPiece.miscStats.HEALTH ? (
                      <span className={styles["ItemCard-stat"]} style={{ color: "yellow" }}>{`(+${gearPiece.miscStats.HEALTH})`}</span>
                    ) : null}
                    {stat === "DEFENSE" && gearPiece.miscStats.DEFENSE ? (
                      <span className={styles["ItemCard-stat"]} style={{ color: "yellow" }}>{`(+${gearPiece.miscStats.DEFENSE})`}</span>
                    ) : null}
                    {stat === "STRENGTH" && gearPiece.miscStats.STRENGTH ? (
                      <span className={styles["ItemCard-stat"]} style={{ color: "yellow" }}>{`(+${gearPiece.miscStats.STRENGTH})`}</span>
                    ) : null}
                    {stat === "DAMAGE" && gearPiece.miscStats.DAMAGE ? (
                      <span className={styles["ItemCard-stat"]} style={{ color: "yellow" }}>{`(+${gearPiece.miscStats.DAMAGE})`}</span>
                    ) : null}

                    {/* Reforge stats additions */}
                    {gearPiece.reforgeStats[stat] && (
                      <span style={{ color: "#0048ff", marginRight: "1px" }}>{`(${gearPiece.reforgeStats[stat] > 0 ? "+" : ""}${
                        gearPiece.reforgeStats[stat]
                      })`}</span>
                    )}

                    {/* Gem stats additions */}
                    {gearPiece.gemStats?.[stat] && <span style={{ color: "#FF54DA", marginRight: "1px" }}>{`(+${gearPiece.gemStats[stat]})`}</span>}

                    {/* Dungeon stats additions */}
                    {gearPiece.generalCategory !== "equipment" && gearPiece.itemType === "dungeon" && gearPiece.dungeonStats[stat] > 0 && (
                      <span style={{ color: "grey" }}>{`(+${formatValue(gearPiece.dungeonStats[stat])})`}</span>
                    )}
                  </div>
                )
            )}

          {/* Gem slots */}
          {gearPiece.gemSlots && (
            <div className={styles["Itemcard-Gemslots"]}>
              {Object.entries(gearPiece.gemSlots).map(([slotName, properties]) => (
                <span className={styles["Itemcard-Gemslots-Gem"]} key={slotName}>
                  {gemstoneSlots[properties.type] && (
                    <>
                      <span className={styles["Itemcard-Gemslots-Popup"]}>
                        {gemstoneSlots[properties.type].gems.map((gemType) => (
                          <div key={`${slotName}${gemType}`} className={styles["Itemcard-Gemslots-Gems-Container"]}>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, undefined, undefined);
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Remove {gemType.toLowerCase()}</div>
                              <div className={styles["Itemcard-Gemslots-Gem-image-Remove"]}>X</div>
                            </div>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, gemType, "ROUGH");
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Rough {gemType.toLowerCase()}</div>
                              <Image
                                height={25}
                                width={25}
                                alt=''
                                className={styles["Itemcard-Gemslots-Gem-image"]}
                                src={`/gemstones/rough/${gemType.toLowerCase()}.png`}
                              />
                            </div>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, gemType, "FINE");
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Fine {gemType.toLowerCase()}</div>
                              <Image
                                height={25}
                                width={25}
                                alt=''
                                className={styles["Itemcard-Gemslots-Gem-image"]}
                                src={`/gemstones/fine/${gemType.toLowerCase()}.png`}
                              />
                            </div>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, gemType, "FLAWED");
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Flawed {gemType.toLowerCase()}</div>
                              <Image
                                height={25}
                                width={25}
                                alt=''
                                className={styles["Itemcard-Gemslots-Gem-image"]}
                                src={`/gemstones/flawed/${gemType.toLowerCase()}.png`}
                              />
                            </div>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, gemType, "FLAWLESS");
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Flawless {gemType.toLowerCase()}</div>
                              <Image
                                height={25}
                                width={25}
                                alt=''
                                className={styles["Itemcard-Gemslots-Gem-image"]}
                                src={`/gemstones/flawless/${gemType.toLowerCase()}.png`}
                              />
                            </div>
                            <div
                              className={styles["Itemcard-Gemslots-Gem-image-Container"]}
                              onClick={() => {
                                updateGem(slotName, properties.type, gemType, "PERFECT");
                              }}>
                              <div className={styles["Itemcard-Gemslots-Gem-image-text"]}>Perfect {gemType.toLowerCase()}</div>
                              <Image
                                height={25}
                                width={25}
                                alt=''
                                className={styles["Itemcard-Gemslots-Gem-image"]}
                                src={`/gemstones/perfect/${gemType.toLowerCase()}.png`}
                              />
                            </div>
                          </div>
                        ))}
                      </span>
                      <span style={{ color: gemCutColor[properties.cut] ?? "#828282", fontWeight: "700" }}>[</span>
                      <span className={styles["Itemcard-Gemslots-Gem-Symbol"]} style={{ color: gemstones[properties.gem]?.color ?? "#828282" }}>
                        {gemstoneSlots[properties.type].symbol}
                      </span>
                      <span style={{ color: gemCutColor[properties.cut] ?? "#828282", fontWeight: "700" }}>]</span>
                    </>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* options to modify enchants */}
          {enchantmentList && (
            <div>
              <div style={{ display: "flex" }}>
                <SearchBox
                  itemList={enchantmentList}
                  onItemChange={(value) => {
                    handleEnchantChange(value);
                  }}
                />
                <InputCounter
                  value={selectedLevel}
                  min={1}
                  isStatic={displayOnly ? true : false}
                  max={enchantMaxLevels}
                  onChange={(value) => setSelectedLevel(value)}
                />
              </div>
              <div className={styles["itemCard-enchant-buttons"]}>
                <button onClick={addEnchant}>Add</button>
                <button onClick={removeEnchant}>Remove</button>
                <button onClick={clearEnchant}>Clear</button>
              </div>
            </div>
          )}
          {/* display enchants on item */}
          <div className={styles["itemCard-enchant-container"]}>
            {gearPiece.enchantments &&
              Object.entries(gearPiece.enchantments).map(([enchant, level], index) => (
                <span key={enchant}>
                  {index % 2 === 0 && <br />}
                  <span className={styles["itemCard-enchant"]}>{`${formatStat(enchant)} ${level} `}</span>
                </span>
              ))}
          </div>
          {gearPiece.effects.map((effect, index) => (
            <div key={effect.name}>
              <div style={{ display: "flex", alignItems: "center", whiteSpace: "pre-wrap" }}>
                <div>{effect.description && parseLore(effect.name, effect.name)}</div>
                {effect.hasOwnProperty("setEffect") ? (
                  <div style={{ display: "flex", alignItems: "center", whiteSpace: "pre-wrap" }}>
                    <span
                      style={{ color: profileContext.profileState.armorSets[effect.name] >= effect.required ? loreColors["§6"] : loreColors["§8"] }}>
                      {` (${profileContext.profileState.armorSets[effect.name] ?? 0}/${effect.required})`}
                    </span>
                    <div
                      className='enabledBox'
                      style={{ backgroundColor: effect.enabled ? "#00ff15" : "red", marginLeft: "10px" }}
                      onClick={() => toggleEffect(index)}></div>
                  </div>
                ) : (
                  effect.hasOwnProperty("enabled") && (
                    <div
                      className='enabledBox'
                      style={{ backgroundColor: effect.enabled ? "#00ff15" : "red", marginLeft: "10px" }}
                      onClick={() => toggleEffect(index)}></div>
                  )
                )}
              </div>
              <div>
                {effect.description && parseLore(effect.description, effect.name)}
                {effect.valued && effect.valuedDisplay(() => profileContext.dispatchProfileUpdate({ type: ProfileActions.UPDATE_STATS }))}
                <br />
              </div>
            </div>
          ))}
          {gearPiece.effects.length === 0 && gearPiece.effectsLore && (
            <div>
              {gearPiece.effectsLore.map((loreString, index) => (
                <div key={`effect-${index}`}>
                  <span style={{ fontSize: "12px" }}>{"(No Effect)"}</span>
                  <div>
                    {parseLore(loreString)}
                    <br />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
