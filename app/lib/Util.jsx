// import axios from "axios";
import Pako from "pako";
import nbt from "nbt";
import { Buffer } from "buffer";
import { loreColors } from "../constants/colors.js";
import { getCollection } from "./DatabaseMethods.js";
import { cache } from "react";
import { unstable_cache } from 'next/cache';

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

export const getHypixelData = unstable_cache(async (firestoreDB, useAdmin) => {
  console.log("cached items");
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
},{revalidate: 3600});

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
