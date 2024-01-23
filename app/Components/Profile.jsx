"use client";
import React, { useState, useEffect } from "react";
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
import LoadingSkeleton from "../Components/LoadingSkeleton";
import StatsBar from "./StatsBar";

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
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(true);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 950) setStatsVisible(true);
      else if (window.innerWidth <= 950) setStatsVisible(false);
    }
    if (window.innerWidth <= 950) setStatsVisible(false);
    window.addEventListener("resize", handleResize);
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
    profileContext.setHypixelData(hypixelItems, data.skills, data.collections);

    if (profileData.hypixelProfiles?.profiles) {
      profileContext.setProfilesData({ UUID: profileData.UUID, profilesArray: profileData.hypixelProfiles.profiles });
      profileContext.buildActiveProfile();
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
    setLoading(false);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigateProfile = (player) => {
    router.push(`/profile/${player}`);
  };

  const loadDefault = () => {
    profileContext.buildProfile();
  };

  const changeProfile = async (profile) => {
    profileContext.buildProfile(profile);
    profileContext.dispatchProfileUpdate({ type: ProfileActions.SET_ACTIVE_PROFILE, payload: profile });
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

  if (loading) {
    return <LoadingSkeleton />;
  } else {
    return (
      <div>
        <div style={{ height: "100vh" }}>
          <div className={InfoBarStyles["InfoBar"]}>
            <button className='MenuIcon' onClick={() => setStatsVisible(!statsVisible)}>
              <div />
              <div />
              <div />
            </button>
            <div className={InfoBarStyles["InfoBar-PlayerInfo"]}>
              <div style={{ paddingRight: "5px" }}>{`${playerName}`}</div>
              {profileContext.profiles.length > 0 && (
                <div style={{ display: "flex", alignItems: "center" }}>
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
              {statsVisible && (
                <div className={`${StatBarStyles["StatsBar"]} ${!statsVisible && "hidden"}`}>
                  <StatsBar />
                </div>
              )}
              <div className='ContentContainer'>
                <div className='ContentNav'>
                  <span className={`ContentNav-Option ${navDisplay.baseStats && "active"}`} onMouseDown={() => handleNavChange("baseStats")}>
                    All Stats
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
  }
};
export default Profile;
