import React from "react";
import { getHypixelData, sortItems } from "@/app/lib/Util";
import Profile from "@/app/Components/Profile";
import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { firebaseConfig } from "@/app/firestoreConfig";
import { getFirestore } from "firebase-admin/firestore";
import { fetchProfile, setProfile, getUUID, setUUID } from "@/app/lib/DatabaseMethods";
import { getLocalFirestore } from "@/app/firestoreConfig";
export const revalidate = 3600;
// 1 min in milliseconds
const CACHE_DURATION = 60 * 1000;

// set service account creds
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
serviceAccount.client_email = process.env.CLIENT_EMAIL;
serviceAccount.client_id = process.env.CLIENT_ID;

// temp store fetched profiles for the session
const fetchedProfiles = {};
const recentUUID = {};

const apps = getApps();

if (process.env.NODE_ENV === "production") {
  if (!apps.length) {
    // Initialize Firebase Admin SDK only if it's not already initialized
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

let hypixelData;
let sortedItems;

const page = async ({ params }) => {
  const useAdminDB = process.env.NODE_ENV === "production";
  const firestoreDB = useAdminDB ? admin.firestore() : getLocalFirestore();

  hypixelData = hypixelData || (await getHypixelData(firestoreDB, useAdminDB));

  // sort the hundreds of items on the server to pass to the client profile component
  sortedItems = sortedItems || (await sortItems(hypixelData));

  // get profile name from params if there
  const profileName = params?.player;
  // const UUID = profileName ? recentUUID[profileName] : null;
  let UUID;
  if (profileName && !recentUUID.hasOwnProperty(profileName)) {
    // try to get from firebase first
    UUID = await getUUID(firestoreDB, profileName, useAdminDB);
    if (!UUID) {
      const UUIDResponse = profileName ? await fetch(`https://api.mojang.com/users/profiles/minecraft/${profileName}`) : null;
      UUID = UUIDResponse?.ok ? (await UUIDResponse.json()).id : null;
      UUID && setUUID(firestoreDB, UUID, profileName, useAdminDB);
    }
    recentUUID[profileName] = UUID;
  } else {
    UUID = recentUUID[profileName];
  }

  // fetch hypixel profile data if UUID is valid
  const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${UUID ?? ""}`;

  let hypixelProfileData = null;
  // check if local cached should be used to return the data
  if (UUID && fetchedProfiles[UUID] && Date.now() - fetchedProfiles[UUID].lastFetched < CACHE_DURATION) {
    hypixelProfileData = fetchedProfiles[UUID].hypixelProfile;
  } else if (UUID) {
    hypixelProfileData = await fetchProfile(firestoreDB, UUID, useAdminDB);
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

      setProfile(firestoreDB, UUID, hypixelProfileData, useAdminDB);
    }
  }

  // create profile information object to pass to profile component
  const profileData = {
    name: profileName,
    UUID: UUID,
    hypixelProfiles: hypixelProfileData,
  };

  return (
    <div>
      <Profile profileData={profileData} data={hypixelData} sortedItems={sortedItems} />
    </div>
  );
};

export default page;
