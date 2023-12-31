import React from "react";
import { getHypixelData, sortItems } from "@/app/lib/Util";
import Profile from "@/app/Components/Profile";
import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "@/app/firestoreConfig";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { fetchProfile, setProfile, fetchProfileWithAdmin, setProfileWithAdmin } from "@/app/lib/DatabaseMethods";
export const revalidate = 3600;
// 1 min in milliseconds
const CACHE_DURATION = 60 * 1000;

// set service account creds
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
serviceAccount.client_email = process.env.CLIENT_EMAIL;
serviceAccount.client_id = process.env.CLIENT_ID;

// temp store fetched profiles for the session
const fetchedProfiles = {};
let firestoreDB;
let hypixelData;
let sortedItems;
const page = async ({ params }) => {
  const setProfileData = async (firestoreDB, UUID, hypixelProfileData) => {
    if (process.env.NODE_ENV === "production") {
      return setProfileWithAdmin(firestoreDB, UUID, hypixelProfileData);
    } else {
      return setProfile(firestoreDB, UUID, hypixelProfileData);
    }
  };
  try {
    const useAdminDB = process.env.NODE_ENV === "production";
    // use admin firestore for production to connect to remote firebase db
    if (process.env.NODE_ENV === "production") {
      if (!admin.apps.length || !firestoreDB) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      firestoreDB = admin.firestore();
    } else {
      // Development mode
      if (!getApps()?.length) {
        // Initialize Firebase with the config object if not already initialized
        const fireStoreApp = initializeApp(firebaseConfig);
        firestoreDB = getFirestore(fireStoreApp);
      } else {
        firestoreDB = getFirestore();
      }
      // Connect to the Firestore emulator
      if (!firestoreDB._settingsFrozen) {
        connectFirestoreEmulator(firestoreDB, "localhost", 8080);
      }
    }

    hypixelData = hypixelData || (await getHypixelData(firestoreDB, useAdminDB));

    // sort the hundreds of items on the server to pass to the client profile component
    sortedItems = sortedItems || (await sortItems(hypixelData));
    // get profile name from params if there
    const profileName = params?.player;

    // fetch UUID if player name is specified
    const UUIDResponse = profileName ? await fetch(`https://api.mojang.com/users/profiles/minecraft/${profileName}`) : null;

    // make sure response is ok and get the id from it
    const UUID = UUIDResponse?.ok ? (await UUIDResponse.json()).id : null;

    // fetch hypixel profile data if UUID is valid
    const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${UUID ?? ""}`;

    let hypixelProfileData = null;
    // check if local cached should be used to return the data
    if (UUID && fetchedProfiles[UUID] && Date.now() - fetchedProfiles[UUID].lastFetched < CACHE_DURATION) {
      hypixelProfileData = fetchedProfiles[UUID].hypixelProfile;
    } else if (UUID) {
      hypixelProfileData =
        process.env.NODE_ENV === "production" ? await fetchProfileWithAdmin(firestoreDB, UUID) : await fetchProfile(firestoreDB, UUID);
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
        setProfileData(firestoreDB, UUID, hypixelProfileData).catch((error) => {
          console.error("Error setting profile data:", error);
        });
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
  } catch (error) {
    <div>
      <p>Error: {error.message}</p>
    </div>;
  }
};

export default page;
