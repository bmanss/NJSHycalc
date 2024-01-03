// import axios from "axios";
import Pako from "pako";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import nbt from "nbt";
import { Buffer } from "buffer";
import { firebaseConfig } from "../firestoreConfig.js";
import { loreColors } from "../constants/colors.js";
import { getCollection,getCollectionWithAdmin } from "./DatabaseMethods.js";
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

export async function getHypixelData(firestoreDB,useAdmin) {
  try {
    
    // set which method to use for getting collection data
    const getDBCollection = useAdmin ? getCollectionWithAdmin : getCollection;
    const itemSnapshot = await getDBCollection(firestoreDB,"items");
    const skillsSnapshot = await getDBCollection(firestoreDB,"skills");
    const collectionsSnapshot = await getDBCollection(firestoreDB,"collections");
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
  } catch (err) {
    console.error("Error fetching JSON data:", err);
    throw err;
  }
}

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
