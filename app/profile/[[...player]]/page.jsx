import React from "react";
import { getHypixelData } from "@/app/lib/Util";
import Profile from "@/app/Components/Profile";
import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "@/app/firestoreConfig";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { fetchProfile,setProfile,fetchProfileWithAdmin,setProfileWithAdmin } from "@/app/lib/DatabaseMethods";
// 1 min in milliseconds
const CACHE_DURATION = 60 * 1000;

serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
serviceAccount.client_email = process.env.CLIENT_EMAIL;
serviceAccount.client_id = process.env.CLIENT_ID;

const fetchedProfiles = {};

// Do something with the data
let hypixelData = null;
let sortedItems = null;
let firestoreDB;
const page = async ({ params }) => {

  // use admin firestore for production to connect to remote firebase db
  if (process.env.NODE_ENV === "production") {
    if (!admin.apps.length) {
      // Initialize Firebase Admin SDK only if it's not already initialized
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firestoreDB = admin.firestore();
  } else {
    // Development mode
    if (!firestoreDB){
      if (!getApps().length) {
        // Initialize Firebase with the config object if not already initialized
        const fireStoreApp = initializeApp(firebaseConfig);
        firestoreDB = getFirestore(fireStoreApp);
      } else {
        firestoreDB = getFirestore();
      }
      // Connect to the Firestore emulator
      connectFirestoreEmulator(firestoreDB, 'localhost', 8080);
    }
  }

  // const hypixelData = await cacheHypixelData();
  const useAdminDB = process.env.NODE_ENV === 'production';
  hypixelData = hypixelData || (await getHypixelData(firestoreDB,useAdminDB));
  const profileName = params?.player;

  // // fetch UUID if player name is specified
  const UUIDResponse = profileName ? await fetch(`https://api.mojang.com/users/profiles/minecraft/${profileName}`) : null;

  // // make sure response is ok and get the id from it
  const UUID = UUIDResponse?.ok ? (await UUIDResponse.json()).id : null;

  // // fetch hypixel profile data if UUID is valid
  const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${UUID ?? ""}`;

  let hypixelProfileData = null;
  // check if local cached should be used to return the data
  if (UUID && fetchedProfiles[UUID] && Date.now() - fetchedProfiles[UUID].lastFetched < CACHE_DURATION) {
    hypixelProfileData = fetchedProfiles[UUID].hypixelProfile;
  } else if (UUID) {
    hypixelProfileData = process.env.NODE_ENV === 'production' ? await fetchProfileWithAdmin(firestoreDB,UUID) : await fetchProfile(firestoreDB,UUID);
    // if database data is older than 1 minute get the new data from hypixel api
    if (!hypixelProfileData || Date.now() - hypixelProfileData.lastCache > CACHE_DURATION) {
      const hypixelResponse = UUID ? await fetch(url, { cache: "no-store" }) : null;
      // check if the response is ok and get the data as json, otherwise keep whatever it currently is
      hypixelProfileData = hypixelResponse?.ok ? await hypixelResponse.json() : hypixelProfileData;

      hypixelProfileData.lastCache = Date.now();

      // cache recently fetched profile 
      fetchedProfiles[UUID] = {
        lastFetched: Date.now(),
        hypixelProfile: hypixelProfileData,
      };

      // choose correct method depending on NODE_ENV
      if (process.env.NODE_ENV === 'production'){
        setProfileWithAdmin(firestoreDB,UUID,hypixelProfileData);
      }
      else {
        setProfile(firestoreDB,UUID,hypixelProfileData);
      }
    }
  }

  // create profile information object to pass to profile component
  const profileData = {
    name: profileName,
    UUID: UUID,
    hypixelProfiles: hypixelProfileData,
  };

  // sort the hundreds of items on the server to pass to the client profile component
  const sortItem = async () => {
    const items = hypixelData;
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
  };

  sortedItems = sortedItems || (await sortItem());

  return (
    <div>
      <Profile profileData={profileData} data={hypixelData} sortedItems={sortedItems} />
    </div>
  );
};

export default page;
