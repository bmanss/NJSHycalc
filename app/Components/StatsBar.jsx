import React, { useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import { powerstoneList } from "../constants/powerstones";
import { ProfileActions } from "../context/ProfileContext";
import { formatStat, formatValue } from "../lib/Util";
import { trackedStats, statAlias } from "../constants/trackedStats";
import { mobList } from "../constants/mobs";
import SearchBox from "./SearchBox";
import StatBarStyles from "../styles/StatDisplays.module.scss";
import * as ProfilesFunctions from "../lib/ProfileFunctions";

const StatsBar = () => {
  const profileContext = useProfileContext();

  const handleStatTypeChange = (event) => {
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_DUNGEON_MODE, payload: event });
  };

  const handleMobChange = (mob) => {
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_TARGET_MOB, payload: mob });
  };

  const handlePowerstoneChange = (newPower) => {
    const updatedStats = profileContext.getBaseStats();
    const currentStone = profileContext.getPowerStone();
    if (newPower === "none") {
      ProfilesFunctions.removeStats(updatedStats, ProfilesFunctions.getPowerstoneStats(currentStone, updatedStats.MAGICAL_POWER));
    } else {
      ProfilesFunctions.removeStats(updatedStats, ProfilesFunctions.getPowerstoneStats(currentStone, updatedStats.MAGICAL_POWER));
      ProfilesFunctions.addStats(updatedStats, ProfilesFunctions.getPowerstoneStats(newPower, updatedStats.MAGICAL_POWER));
    }
    const updatedState = {
      powerstone: newPower,
      basePlayerStats: updatedStats,
    };
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_MULTIPLE, payload: { ...updatedState } });
  };

  const setGodPotion = () => {
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_GOD_POTION, payload: !profileContext.godPotionStatus() });
  };

  return (
    <>
      <div className={StatBarStyles["StatsBar-Header"]}>Stats:</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <span className={StatBarStyles["StatToggle"]}>
          <input type='checkbox' id='checkbox' onChange={(e) => handleStatTypeChange(e.target.checked)} />
          <label htmlFor='checkbox'></label>
        </span>
      </div>
      <div className={StatBarStyles["StatsBar-ItemGroup"]}>
        <div>God Potion</div>
        <div
          className='enabledBox'
          style={{ backgroundColor: profileContext.godPotionStatus() ? "#2bff00" : "#ff0000", borderRadius: "2px" }}
          onClick={setGodPotion}
        />
      </div>
      <div className={StatBarStyles["StatsBar-ItemGroup"]}>
        <span>PowerStone: </span>
        <SearchBox
          maxWidth={"155px"}
          placeholder={"Powerstone"}
          itemList={powerstoneList()}
          selectedItem={profileContext.getPowerStone()}
          onItemChange={(value) => handlePowerstoneChange(value)}
        />
      </div>
      {Object.entries(trackedStats).map(([stat]) => (
        <span key={stat}>
          <span style={{ color: trackedStats[stat].color ?? "white" }}>
            {trackedStats[stat].Symbol} {statAlias[stat] ? statAlias[stat].toLowerCase() : formatStat(stat)}:{" "}
          </span>
          <span>{profileContext.getFinalStats()[stat]?.toFixed(2) ?? 0}</span>
        </span>
      ))}
      <div className={StatBarStyles["StatsBar-Header"]} style={{ marginTop: "10px" }}>
        Damage Stats:
      </div>
      <div className={StatBarStyles["StatsBar-ItemGroup"]}>
        <span>Target Mob</span>
        <SearchBox
          maxWidth={"155px"}
          placeholder={"Mob Type"}
          itemList={mobList()}
          selectedItem={profileContext.getTargetMob()}
          onItemChange={(value) => handleMobChange(value)}
        />
      </div>
      {/* damage stats */}
      <span> Regular: {formatValue(profileContext.getFinalStats().hitValues?.regular)}</span>
      <span> Crit: {formatValue(profileContext.getFinalStats().hitValues.critHit)}</span>
      <span> First Strike: {formatValue(profileContext.getFinalStats().hitValues.firstStrike)}</span>
      <span> First Strike Crit: {formatValue(profileContext.getFinalStats().hitValues.firstStrikeCrit)}</span>
      <span> Ability: {formatValue(profileContext.getFinalStats().hitValues.magic)}</span>
    </>
  );
};

export default StatsBar;
