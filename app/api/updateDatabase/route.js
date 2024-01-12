import { filterItemList } from "@/app/lib/Util";
import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { itemsToRemove, customItems } from "@/app/constants/items";

// only allow updating every hour
export const revalidate = 3600;
export async function GET() {
  try {
    const time = new Date(Date.now());
    serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
    serviceAccount.client_email = process.env.CLIENT_EMAIL;
    serviceAccount.client_id = process.env.CLIENT_ID;
    const apps = getApps();
    if (process.env.NODE_ENV === "production" && !apps.length) {
      // Initialize Firebase Admin SDK only if it's not already initialized
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    const firestoreDB = admin.firestore();

    const urls = [
      "https://api.hypixel.net/resources/skyblock/skills",
      "https://api.hypixel.net/resources/skyblock/items",
      "https://api.hypixel.net/resources/skyblock/collections",
    ];
    const [skillsApi, skyblockItems, collectionsApi] = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }
        return response.json();
      })
    );
    const skillsApiData = skillsApi.skills;
    const skyblockItemsData = skyblockItems;
    const collectionsData = collectionsApi;

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

    for (const [key, values] of Object.entries(dataToUpload)) {
      const mainDocRef = firestoreDB.collection("items").doc(key);
      await mainDocRef.set(values, { merge: true });
    }

    // upload skills
    for (const [skill, skillValues] of Object.entries(simplifiedSkills)) {
      const docRef = firestoreDB.collection("skills").doc(skill);
      await docRef.set(skillValues);
    }

    // upload collections
    for (const [category, skyblockCollection] of Object.entries(collectionsData.collections)) {
      const categoryCollections = {};
      const docRef = firestoreDB.collection("collections").doc(category);
      for (const [item, collectionInfo] of Object.entries(skyblockCollection.items)) {
        categoryCollections[item] = collectionInfo;
      }
      await docRef.set(categoryCollections);
    }
    const successResponse = {
      success: "Data successfully updated.",
      lastUpdate: time.toUTCString(),
    };
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred", reason: { code: error.code, name: error.name } }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
