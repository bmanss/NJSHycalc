import axios from "axios";
import { itemsToRemove, customItems } from "../constants/items";
import { doc,setDoc } from "firebase/firestore";

async function filterItemList(hypixelItemList) {
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

export async function updateDatabaseItems() {
  const fireStoreApp = initializeApp(firebaseConfig);
  const firestoreDB = getFirestore(fireStoreApp);
  connectFirestoreEmulator(firestoreDB, "localhost", 8080);
  const [skillsApi, skyblockItems, collectionsApi] = await Promise.all([
    axios.get("https://api.hypixel.net/resources/skyblock/skills"),
    axios.get("https://api.hypixel.net/resources/skyblock/items"),
    axios.get("https://api.hypixel.net/resources/skyblock/collections"),
  ]);
  const skillsApiData = skillsApi.data.skills;
  const skyblockItemsData = skyblockItems.data;
  const collectionsData = collectionsApi.data;

  // filter items from api
  const dataToUpload = await filterItemList(skyblockItemsData.items);
  const simplifiedSkills = {};

  // remove unused stuff from skills api data
  for (const [skill, values] of Object.entries(skillsApiData)) {
    simplifiedSkills[skill] = {
      maxLevel: values.maxLevel,
      levels: values.levels,
    };
  }

  // remove specific items
  for (const item of itemsToRemove) {
    delete dataToUpload[item.category][item.id];
  }

  // add custom items
  for (const [item, properties] of Object.entries(customItems)) {
    const category = properties.category.toLowerCase();
    const original = dataToUpload[category][properties.id];

    // if theres already an item then merge the two *currently only expects one type of nested object*
    if (original) {
      const mergedItem = { ...original };
      for (const [key, value] of Object.entries(customItems[item])) {
        if (typeof value === "object") {
          mergedItem[key] = original[key] ? { ...original[key] } : {};
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            mergedItem[key][nestedKey] = nestedValue;
          }
        } else {
          mergedItem[key] = value;
        }
      }
      dataToUpload[category][properties.id] = mergedItem;
    }
    // set new one as that item
    else {
      dataToUpload[category][properties.id] = customItems[item];
    }
  }

  // Upload main data
  for (const [key, values] of Object.entries(dataToUpload)) {
    const mainDocRef = doc(firestoreDB, "items", key);
    await setDoc(mainDocRef, values, { merge: true });
  }

  // Upload skills
  for (const [skill, skillValues] of Object.entries(simplifiedSkills)) {
    const docRef = doc(firestoreDB, "skills", skill);
    await setDoc(docRef, skillValues);
  }

  // Upload collections
  for (const [category, skyblockCollection] of Object.entries(collectionsData.collections)) {
    const categoryCollections = {};
    const docRef = doc(firestoreDB, "collections", category);
    for (const [item, collectionInfo] of Object.entries(skyblockCollection.items)) {
      categoryCollections[item] = collectionInfo;
    }
    await setDoc(docRef, categoryCollections);
  }
}
