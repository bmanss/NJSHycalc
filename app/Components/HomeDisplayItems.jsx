"use client";
import React from "react";
import { useProfileContext } from "../context/ProfileContext";
import ItemCard from "./ItemCard";
import { reforgeList } from "../constants/reforges";
import { enchantmentList } from "../constants/enchantments";
import PetDisplay from "./PetDisplay";
import { setNewPet } from "../lib/ProfileFunctions";
import styles from "../styles/homePage.module.scss";

const HomeDisplayItems = () => {
  const profileContext = useProfileContext();
  const displayPet = {
    ...profileContext.getGearPiece("pet"),
    name: "ENDER DRAGON",
    tier: "LEGENDARY",
    level: 100,
  };
  setNewPet(displayPet);

  const displayItem = {
    ...profileContext.getGearPiece("helmet"),
    name: "Superior Dragon Helmet",
    id: "SUPERIOR_DRAGON_HELMET",
    itemType: "dungeon",
    tier: "LEGENDARY",
    starLevel: 10,
    hotPotatoCount: 7,
    nonDungeonStats: {
      WALK_SPEED: 3,
      DEFENSE: 130,
      HEALTH: 90,
      STRENGTH: 10,
      CRITICAL_DAMAGE: 10,
      CRITICAL_CHANCE: 2,
      INTELLIGENCE: 25,
    },
    miscStats: {
      DEFENSE: 14,
      HEALTH: 28,
    },
    effects: [
      {
        name: "§6Full Set Bonus: Superior Blood",
        description: "§7Most of your stats are increased\n§7by §a5% §7and §6Aspect of the\n§6Dragons §7ability deals §a50%\n§7more damage.",
      },
    ],
  };

  return (
    <div className={styles.displayGear}>
      <ItemCard
        itemList={null}
        displayOnly={true}
        gearPiece={displayItem}
        reforgeList={reforgeList.helmet}
        enchantmentList={enchantmentList.helmet}
      />
      <PetDisplay displayOnlyPet={displayPet} />
    </div>
  );
};

export default HomeDisplayItems;
