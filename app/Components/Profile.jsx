"use client";
import React, { useState, useEffect } from "react";
import * as ProfilesFunctions from "../lib/ProfileFunctions";
import SearchBox from "./SearchBox";
import { powerstoneList } from "../constants/powerstones";
import { mobList } from "../constants/mobs";
import { trackedStats, statAlias } from "../constants/trackedStats";
import { useProfileContext } from "../context/ProfileContext";
import { ProfileActions } from "../context/ProfileContext";
import { PlayerArmor } from "./ProfileDisplays/PlayerArmor";
import { PlayerEquipment } from "./ProfileDisplays/PlayerEquipment";
import { PlayerCombatGear } from "./ProfileDisplays/PlayerCombatGear";
import { PlayerStats } from "./ProfileDisplays/PlayerStats";
import { PlayerSkills } from "./ProfileDisplays/PlayerSkills";
import { PlayerCollections } from "./ProfileDisplays/PlayerCollections";
import { useRouter } from "next/navigation";
import InfoBarStyles from "../styles/InfoBar.module.scss";
import StatBarStyles from "../styles/StatDisplays.module.scss";

const Profile = ({ sortedItems, data, profileData }) => {
  const router = useRouter();
  const profileContext = useProfileContext();
  const [playerName, setPlayerName] = useState(profileData.name || "Default-Profile");
  const [navDisplay, setNavDisplay] = useState({
    armor: true,
    baseStats: false,
    skills: false,
    collections: false,
    equipment: false,
    combatGear: false,
    active: "armor",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [godPotionEnabled, setGodPotionEnabled] = useState(() => {
    return false;
  });

  useEffect(() => {
    // set profile context data on initial load
    const hypixelItems = {
      accessories: data.accessories ?? {},
      belt: data.belt ?? {},
      chestplate: data.chestplate ?? {},
      cloak: data.cloak ?? {},
      gloves: data.gloves ?? {},
      helmet: data.helmet ?? {},
      leggings: data.leggings ?? {},
      boots: data.boots ?? {},
      necklace: data.necklace ?? {},
      weapon: data.weapon ?? {},
    };
    // console.log(data.collections);
    profileContext.setHypixelData(hypixelItems, data.skills, data.collections);
  }, []);

  // handle player data on component load
  useEffect(() => {
    if (profileData.hypixelProfiles?.profiles) {
      profileContext.setProfilesData({ UUID: profileData.UUID, profilesArray: profileData.hypixelProfiles.profiles });
      profileContext.buildActiveProfile();
      setGodPotionEnabled(true);
    } else {
      loadDefault();
      setPlayerName("Default-Profile");
      profileContext.setProfilesData({ UUID: null, profilesArray: null });
      profileContext.buildProfile();
      if (profileData.name != null) setErrorMessage(!profileData.UUID ? "Unable to get profile UUID" : "Unable to get Hypixel profile data");
      setTimeout(() => {
        setErrorMessage("");
      }, 1500);
    }
  }, []);

  const navigateProfile = (player) => {
    router.push(`/profile/${player}`);
  };

  const loadDefault = () => {
    // setPlayerName("Default-Profile");
    // profileContext.setProfilesData({ UUID: null, profilesArray: null });
    profileContext.buildProfile();
    setGodPotionEnabled(false);
  };

  const changeProfile = async (profile) => {
    profileContext.buildProfile(profile);
    setGodPotionEnabled(true);
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_ACTIVE_PROFILE, payload: profile });
  };

  const handleMobChange = (mob) => {
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_TARGET_MOB, payload: mob });
  };

  const handleGodPotion = () => {
    const updatedStats = profileContext.getBaseStats();
    if (!godPotionEnabled) {
      ProfilesFunctions.addStats(updatedStats, ProfilesFunctions.godPotionStats);
      setGodPotionEnabled(true);
    } else if (godPotionEnabled) {
      ProfilesFunctions.removeStats(updatedStats, ProfilesFunctions.godPotionStats);
      setGodPotionEnabled(false);
    }
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_BASE_PLAYER_STATS, payload: { ...profileContext.getBaseStats() } });
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

  const handleNavChange = (location) => {
    setNavDisplay((currentNav) => {
      return {
        ...currentNav,
        [currentNav.active]: false,
        [location]: true,
        active: location,
      };
    });
  };

  const handleStatTypeChange = (event) => {
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_DUNGEON_MODE, payload: event });
  };

  return (
    <div>
      <div style={{ height: "100vh" }}>
        <div className={InfoBarStyles["InfoBar"]}>
          <div className={InfoBarStyles["InfoBar-PlayerInfo"]}>
            <div>{`${playerName} `}</div>
            {profileContext.profiles.length > 0 && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>On </div>
                <div className={InfoBarStyles["InfoBar-Cutename"]}>
                  {profileContext.profileState.activeProfile}
                  <div className={InfoBarStyles["InfoBar-Cutename-Dropdown"]}>
                    {profileContext.profiles.map((profile) => (
                      <div key={profile} onMouseDown={() => changeProfile(profile)} className={InfoBarStyles["InfoBar-Cutename-Dropdown-item"]}>
                        {profile}
                      </div>
                    ))}
                  </div>
                </div>
                {/* <div> Playing {profileContext.profilesData[selectedProfile]?.gameMode ?? "Normal"}</div> */}
              </div>
            )}
          </div>
          <div style={{ display: "flex", columnGap: "10px" }}>
            <input
              placeholder='Player Profile'
              value={playerSearch}
              className={InfoBarStyles["InfoBar-Player-Search"]}
              type='text'
              onChange={(e) => setPlayerSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerSearch) navigateProfile(playerSearch);
              }}></input>
            <button
              className={InfoBarStyles["InfoBar-Player-Search-button"]}
              onClick={() => {
                playerSearch && navigateProfile(playerSearch);
              }}>
              Load
            </button>
            <button className={InfoBarStyles["InfoBar-Player-Search-button"]} onClick={loadDefault}>
              Default
            </button>
            <span style={{ color: "red" }}>{errorMessage}</span>
          </div>
        </div>
        <div style={{ height: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div className={StatBarStyles["StatsBar"]}>
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
                  style={{ backgroundColor: godPotionEnabled ? "#2bff00" : "#ff0000", borderRadius: "2px" }}
                  onClick={handleGodPotion}
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
                    {trackedStats[stat].Symbol} {statAlias[stat] ? statAlias[stat].toLowerCase() : stat.replaceAll("_", " ").toLowerCase()}:{" "}
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
              <span> Regular: {parseFloat(profileContext.getFinalStats().hitValues?.regular?.toFixed(2)).toLocaleString() ?? 0}</span>
              <span> Crit: {parseFloat(profileContext.getFinalStats().hitValues?.critHit?.toFixed(2)).toLocaleString() ?? 0}</span>
              <span> First Strike: {parseFloat(profileContext.getFinalStats().hitValues?.firstStrike?.toFixed(2)).toLocaleString() ?? 0}</span>
              <span>
                {" "}
                First Strike Crit: {parseFloat(profileContext.getFinalStats().hitValues?.firstStrikeCrit?.toFixed(2)).toLocaleString() ?? 0}
              </span>
              <span> Ability: {parseFloat(profileContext.getFinalStats().hitValues?.magic?.toFixed(2)).toLocaleString() ?? 0}</span>
            </div>
            <div className='ContentContainer'>
              <div className='ContentNav'>
                <span className={`ContentNav-Option ${navDisplay.baseStats && "active"}`} onMouseDown={() => handleNavChange("baseStats")}>
                  Stat Extras
                </span>
                <span className={`ContentNav-Option ${navDisplay.skills && "active"}`} onMouseDown={() => handleNavChange("skills")}>
                  Skills
                </span>
                <span className={`ContentNav-Option ${navDisplay.collections && "active"}`} onMouseDown={() => handleNavChange("collections")}>
                  Collections
                </span>
                <span className={`ContentNav-Option ${navDisplay.armor && "active"}`} onMouseDown={() => handleNavChange("armor")}>
                  Armor
                </span>
                <span className={`ContentNav-Option ${navDisplay.equipment && "active"}`} onMouseDown={() => handleNavChange("equipment")}>
                  Equipment
                </span>
                <span className={`ContentNav-Option ${navDisplay.combatGear && "active"}`} onMouseDown={() => handleNavChange("combatGear")}>
                  Combat Gear
                </span>
              </div>
              <div className='ContentContainer-Display'>
                {navDisplay.armor && <PlayerArmor sortedItems={sortedItems} />}
                {navDisplay.equipment && <PlayerEquipment sortedItems={sortedItems} />}
                {navDisplay.combatGear && <PlayerCombatGear sortedItems={sortedItems} />}
                {navDisplay.baseStats && <PlayerStats />}
                {navDisplay.skills && <PlayerSkills skillCaps={data.skillCaps} />}
                {navDisplay.collections && <PlayerCollections />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
