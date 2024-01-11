// import axios from "axios";
import Pako from "pako";
import nbt from "nbt";
import { Buffer } from "buffer";
import { loreColors } from "../constants/colors.js";
import { getCollection } from "./DatabaseMethods.js";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export async function parseNBT(encodedData) {
  return new Promise((resolve, reject) => {
    nbt.parse(Pako.ungzip(Buffer.from(encodedData, "base64"), { to: "Uint8Array" }), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export const formatStat = (stat) => {
  return stat.replaceAll("_", " ").toLowerCase();
};

export const formatValue = (value) => {
  value = parseFloat(value).toFixed(2);
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const sortItems = cache(async (items) => {
  const categories = ["helmet", "chestplate", "leggings", "boots", "necklace", "cloak", "belt", "gloves", "weapon"];

  const sortedItems = {};

  categories.forEach((category) => {
    sortedItems[category] = Object.entries(items[category]).map(([item, props]) => ({
      name: props.name,
      id: props.id,
      tier: props.tier,
    }));

    // Add an empty string element to the beginning of the array
    sortedItems[category].unshift({ name: "", tier: "COMMON", id: "none" });

    // Sort the items by name
    sortedItems[category].sort((a, b) => a.name.localeCompare(b.name));

    // set the empty string element to the 'unequipped' option
    sortedItems[category][0].name = "Unequipped";
  });
  return sortedItems;
});

export const getHypixelData = unstable_cache(
  async (firestoreDB, useAdmin) => {
    // try {
    // set which method to use for getting collection data
    const itemSnapshot = await getCollection(firestoreDB, "items", useAdmin);
    const skillsSnapshot = await getCollection(firestoreDB, "skills", useAdmin);
    const collectionsSnapshot = await getCollection(firestoreDB, "collections", useAdmin);
    const hypixelData = { skills: {}, collections: {}, skillCaps: {} };
    itemSnapshot.forEach((doc) => {
      hypixelData[doc.id] = doc.data();
    });
    skillsSnapshot.forEach((doc) => {
      hypixelData.skills[doc.id] = doc.data();
    });
    collectionsSnapshot.forEach((doc) => {
      hypixelData.collections[doc.id] = doc.data();
    });

    const skillCaps = {};
    for (const skill of Object.keys(hypixelData.skills)) {
      skillCaps[skill] = hypixelData.skills[skill].maxLevel;
    }
    skillCaps.CATACOMBS = 50;

    hypixelData.skillCaps = skillCaps;
    return hypixelData;
    // } catch (err) {
    //   console.error("Error fetching JSON data:", err);
    //   return null;
    //   // throw err;
    // }
  },
  { revalidate: 3600 }
);

export function parseLore(loreString, key) {
  const lines = loreString.split("\n");
  const output = lines.map((line, index) => {
    let symbolIndex = 0;
    const lineOutput = [];
    while (symbolIndex < line.length) {
      let nextSymbol = symbolIndex + 1;
      while (nextSymbol < line.length && line.charAt(nextSymbol) !== "§") nextSymbol++;
      const color = loreColors[line.substring(symbolIndex, symbolIndex + 2)] ?? "white";
      lineOutput.push(
        <span key={`lineindex${index}-${symbolIndex}`} style={{ color: color }}>
          {line.substring(symbolIndex + 2, nextSymbol)}
        </span>
      );
      symbolIndex = nextSymbol;
    }
    lineOutput.push(<br key={`lineindex${index}-${symbolIndex}br`} />);
    return lineOutput;
  });
  return output;
}

export async function filterItemList(hypixelItemList) {
  const filteredList = {
    helmet: {},
    chestplate: {},
    leggings: {},
    boots: {},
    weapon: {},
    necklace: {},
    cloak: {},
    belt: {},
    gloves: {},
    accessories: {},
  };

  hypixelItemList.forEach((item) => {
    item.name = item.name.replace(/[^a-zA-Z0-9\s/]/g, "");
    if (item.id.includes("STARRED")) item.name = `⚚ ${item.name}`;

    // remove unused attributes
    item.requirements && delete item.requirements;
    item.catacombs_requirements && delete item.catacombs_requirements;
    item.salvages && delete item.salvages;
    item.durability && delete item.durability;
    item.npc_sell_price && delete item.npc_sell_price;
    item.skin && delete item.skin;
    item.soulbound && delete item.soulbound;
    item.dungeon_item_conversion_cost && delete item.dungeon_item_conversion_cost;

    for (let [prop, values] of Object.entries(item)) {
      // modify this field and store it as essence_type instead (removes nested arrays)
      if (prop == "upgrade_costs") {
        // loop through first upgrade cost looking for essence type if not then fall back on the itemId
        for (const [_, upgradeCost] of Object.entries(values[0])) {
          if (upgradeCost.essence_type) item.essence_type = upgradeCost.essence_type;
        }

        // can maybe use the 'can have attributes property' idk if that's true for all crimson items tho
        // default to the first item id
        item.essence_type = item.essence_type;
        if (!item.essence_type) {
          // check that last upgrade for heavy pearls to set if its a crimson item
          for (const costs of item.upgrade_costs[item.upgrade_costs.length - 1]) {
            if (costs.item_id && costs.item_id === "HEAVY_PEARL") {
              item.essence_type = "CRIMSON";
            }
          }
        }

        delete item.upgrade_costs;
      }
      // remove unused nested array from gemstone slots
      else if (prop == "gemstone_slots") {
        for (const slot of values) {
          slot.costs && delete slot.costs;
        }
      }
      // remove any nested arrays so firebase will accept the data
      else if (Array.isArray(values)) {
        item[prop] = 0;
      }
    }
    switch (item.category) {
      case "HELMET":
        filteredList.helmet[item.id] = item;
        break;
      case "CHESTPLATE":
        filteredList.chestplate[item.id] = item;
        break;
      case "LEGGINGS":
        filteredList.leggings[item.id] = item;
        break;
      case "BOOTS":
        filteredList.boots[item.id] = item;
        break;
      case "SWORD":
      case "BOW":
      case "FISHING_WEAPON":
        filteredList.weapon[item.id] = item;
        break;
      case "NECKLACE":
        filteredList.necklace[item.id] = item;
        break;
      case "CLOAK":
        filteredList.cloak[item.id] = item;
        break;
      case "BELT":
        filteredList.belt[item.id] = item;
        break;
      case "BRACELET":
        item.category = "GLOVES";
        filteredList.gloves[item.id] = item;
        break;
      case "GLOVES":
        filteredList.gloves[item.id] = item;
        break;
      case "ACCESSORY":
        filteredList.accessories[item.id] = item;
        break;
      default:
        if (item.hasOwnProperty("stats")) {
          filteredList.weapon[item.id] = item;
        }
        break;
    }
  });

  return filteredList;
}
