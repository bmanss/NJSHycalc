"use client";
import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchUUID } from "../LocalTesting/fetchUUID";
import { fetchUUID } from "../lib/Util";
import * as ProfilesFunctions from "../lib/ProfileFunctions";
import { useRef } from "react";
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

const Profile = ({ sortedItems, skillCaps, data, profileName, profileData }) => {
  const router = useRouter();
  const profileContext = useProfileContext();
  const [playerUUID, setUUID] = useState("");
  //   const [profileData, setProfileData] = useState(null);
  const [navDisplay, setNavDisplay] = useState({
    armor: true,
    baseStats: false,
    skills: false,
    collections: false,
    equipment: false,
    combatGear: false,
    active: "armor",
  });
  //   const { profileName } = useParams();
  //   const profileName = null;
  //   const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  //   const skillCaps = useRef(JSON.parse(localStorage.getItem("HypixelData")).skillCaps);

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

  async function getHypixelProfile(uuid) {
    // // check local storage first
    // const recentProfile = JSON.parse(localStorage.getItem("cachedProfile"));
    // const CACHE_DURATION = 60 * 1000;
    // // load cached version
    // if (recentProfile && recentProfile.uuid == uuid && Date.now() - recentProfile.data.lastCache < CACHE_DURATION) {
    //   setProfileData(recentProfile.data);
    // } else {
    //   // use this when local testing
    //   // const response = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=&uuid=${uuid}`);
    //   const response = await fetch(`/.netlify/functions/api?uuid=${uuid}`);
    //   // throw error if player has no hypixel profile
    //   if (response.status !== 200) {
    //     setProfileLoading(false);
    //     throw new Error("Error Fetching Profile Data");
    //   }
    //   const data = await response.json();
    //   // load api version
    //   const cachedProfile = { uuid: uuid, data: data.profiles };
    //   localStorage.setItem("cachedProfile", JSON.stringify(cachedProfile));
    //   setProfileData(data);
    // }
    // setProfileLoading(false);
  }

  const navigateProfile = (player) => {
    router.push(`/profile/${player}`);
    // setProfileLoading(true);
    // async function getNewProfile() {
    //   const uuid = await fetchUUID(player);
    //   getHypixelProfile(uuid.id);
    //   setUUID(uuid.id);
    //   navigate(`/profile/${player}`);
    // }
    // getNewProfile().catch((error) => {
    //   if (error.response && error.response.status) {
    //     setErrorMessage(`Error ${error.response.status} unable to fetch profile.`);
    //   } else {
    //     setErrorMessage("Profile Not Found.");
    //   }
    //   setTimeout(() => {
    //     setErrorMessage("");
    //   }, 1500);
    // });
    // setPlayerSearch("");
  };

  async function validateProfile() {
    // const data = await fetchUUID(profileName);
    // console.log(data);
    // if (profileName === undefined) {
    //   // make default profile god potion disabled by default
    //   setGodPotionEnabled(false);
    // } else {
    //   try {
    //     const data = await fetchUUID(profileName);
    //     await getHypixelProfile(data.id);
    //     setUUID(data.id);
    //     setProfileLoading(false);
    //     document.title = `Hycalc - ${profileName}`;
    //   } catch (error) {
    //     console.error("Error fetching UUID.");
    //     setErrorMessage("Profile not found.");
    //     setTimeout(() => {
    //       setErrorMessage("");
    //     }, 1500);
    //     navigate("/");
    //   }
    // }
  }

  useEffect(() => {
    // if profile name but invalid uuid -> player not found
    // if valid uuid but no profile data -> unable to get player data
    profileData.hypixelProfiles && profileContext.setProfilesData({ UUID: profileData.UUID, profilesArray: profileData.hypixelProfiles.profiles });
    profileContext.buildActiveProfile();
  },[]);

  const loadDefault = () => {
    async function test() {
      profileContext.setProfilesData({ UUID: profileData.UUID, profilesArray: profileData.hypixelProfiles.profiles });
      console.log(profileData.UUID, profileData.hypixelProfiles);
      // setProfileData(dataa);
      profileContext.buildActiveProfile();
    }
    test();
    // profileContext.buildProfile();
    // setGodPotionEnabled(false);
    // navigate("/");
  };

  //   useEffect(() => {
  //     if (profileName != null && profileData.UUID === null) {
  //       console.log("go back");
  //       router.replace("/profile");
  //     }
  //   }, []);

  useEffect(() => {
    if (profileName) {
      //   setProfileLoading(true);
      validateProfile();
    } else {
      profileContext.buildProfile();
      setGodPotionEnabled(false);
    }
  }, [profileName]);

  async function parseProfile() {
    profileContext.buildActiveProfile();
  }

  //   useEffect(() => {
  //     if (profileData !== null) {
  //       profileContext.setProfilesData({ UUID: playerUUID, profilesArray: profileData.profiles });
  //       setGodPotionEnabled(true);
  //     }
  //     parseProfile();
  //   }, [profileData]);

  const changeProfile = async (profile) => {
    profileContext.buildProfile(profile);
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
        <div className='InfoBar'>
          <div className='InfoBar-PlayerInfo'>
            <div>{`${profileData.name && profileData.hypixelProfiles ? profileName : "Default-Profile"} `}</div>
            {profileData.name && profileData.hypixelProfiles && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>On </div>
                <div className={"InfoBar-Cutename"}>
                  {profileContext.profileState.activeProfile}
                  <div className='InfoBar-Cutename-Dropdown'>
                    {profileContext.profiles.map((profile) => (
                      <div key={profile} onMouseDown={() => changeProfile(profile)} className='InfoBar-Cutename-Dropdown-item'>
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
              className='InfoBar-Player-Search'
              type='text'
              onChange={(e) => setPlayerSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerSearch) navigateProfile(playerSearch);
              }}></input>
            <button
              className='InfoBar-Player-Search-button'
              onClick={() => {
                playerSearch && navigateProfile(playerSearch);
              }}>
              Load
            </button>
            <button className='InfoBar-Player-Search-button' onClick={loadDefault}>
              Default
            </button>
            <span style={{ color: "red" }}>{errorMessage}</span>
          </div>
        </div>
        <div style={{ height: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div className='StatsBar'>
              <div className='StatsBar-Header'>Stats:</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <span className='StatToggle'>
                  <input type='checkbox' id='checkbox' onChange={(e) => handleStatTypeChange(e.target.checked)} />
                  <label htmlFor='checkbox'></label>
                </span>
              </div>
              <div className='StatsBar-ItemGroup'>
                <div>God Potion</div>
                <div
                  className='enabledBox'
                  style={{ backgroundColor: godPotionEnabled ? "#2bff00" : "#ff0000", borderRadius: "2px" }}
                  onClick={handleGodPotion}
                />
              </div>
              <div className='StatsBar-ItemGroup'>
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
              <div className='StatsBar-Header' style={{ marginTop: "10px" }}>
                Damage Stats:
              </div>
              <div className='StatsBar-ItemGroup'>
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
              {/* Special case for lion pet **no longer applicable since 0.19.8**  */}
              {/* {profileContext.getFinalStats().hitValues?.magic !== profileContext.getFinalStats().hitValues?.magicFirstStrike && (
                <span>
                  {" "}
                  Ability First Strike: {parseFloat(profileContext.getFinalStats().hitValues?.magicFirstStrike?.toFixed(2)).toLocaleString() ?? 0}
                </span>
              )} */}
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
              {profileLoading ? (
                <div style={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center", height: "75%" }}>Loading</div>
              ) : (
                <div>
                  {navDisplay.armor && <PlayerArmor sortedItems={sortedItems} />}
                  {navDisplay.equipment && <PlayerEquipment sortedItems={sortedItems} />}
                  {navDisplay.combatGear && <PlayerCombatGear sortedItems={sortedItems} />}
                  {navDisplay.baseStats && <PlayerStats />}
                  {navDisplay.skills && <PlayerSkills skillCaps={skillCaps} />}
                  {navDisplay.collections && <PlayerCollections />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
