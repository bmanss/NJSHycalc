import React from "react";
// import { getHypixelData } from "../lib/Util.jsx";
import { cacheHypixelData } from "@/app/LocalTesting/cacheHypixelData";
import Profile from "@/app/Components/Profile";
import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";

// 1 min in milliseconds
const CACHE_DURATION = 60 * 1000;

const fetchedProilfes = {};
const page = async ({ params }) => {
  if (!admin.apps.length) {
    // Initialize Firebase Admin SDK only if it's not already initialized
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const firestoreDB = admin.firestore();

  //   const hypixelData = await getHypixelData();
  const hypixelData = await cacheHypixelData();
  const profileName = params.player;

  // fetch UUID if player name is specified do not cache as this data can change on each call
  const UUIDResponse = profileName ? await fetch(`https://api.mojang.com/users/profiles/minecraft/${profileName}`) : null;

  // make sure response is ok and get the id from it
  const UUID = UUIDResponse?.ok ? (await UUIDResponse.json()).id : null;

  // fetch hypixel profile data if UUID is valid
  const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${UUID}`;

  // get api response cache for 1 minute
  // const hypixelResponse = UUID ? await fetch(url,{ next: { revalidate:  60 }}) : null;

  let hypixelProfileData = null;

  // check if local cached should be used to return the data
  if (UUID && fetchedProilfes[UUID] && Date.now() - fetchedProilfes[UUID].lastFetched < CACHE_DURATION) {
    hypixelProfileData = fetchedProilfes[UUID].hypixelProfile;
  } else {
    hypixelProfileData = (await firestoreDB.collection("profileData").doc(UUID).get()).data();
    // if database data is older than 1 minute get the new data from hypixel api
    if (Date.now() - hypixelProfileData.lastCache > CACHE_DURATION) {
      const hypixelResponse = UUID ? await fetch(url, { cache: "no-store" }) : null;
      // check if the response is ok and get the data as json, otherwise keep whatever it currently is
      hypixelProfileData = hypixelResponse?.ok ? await hypixelResponse.json() : hypixelProfileData;

      hypixelProfileData.lastCache = Date.now();
      fetchedProilfes[UUID] = {
        lastFetched: Date.now(),
        hypixelProfile: hypixelProfileData,
      };
      firestoreDB.collection("profileData").doc(UUID).set(hypixelProfileData);
    }
  }

  // create profile information object to pass to profile component
  const profileData = {
    name: params.player,
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
  const sortedItems = await sortItem();

  return (
    <div>
      <Profile profileData={profileData} profileName={profileName} data={hypixelData} sortedItems={sortedItems} skillCaps={hypixelData.skillCaps} />
    </div>
  );
};

export default page;