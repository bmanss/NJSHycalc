import { NextResponse } from "next/server";
import { getDocs, collection, getFirestore, terminate } from "firebase/firestore";
import { firebaseConfig } from "@/app/firestoreConfig";
import { initializeApp } from "firebase/app";

export async function GET() {
  try {
    const fireStoreApp = initializeApp(firebaseConfig);
    const firestoreDB = getFirestore(fireStoreApp);
    const itemSnapshot = await getDocs(collection(firestoreDB, "items"));
    const skillsSnapshot = await getDocs(collection(firestoreDB, "skills"));
    const collectionsSnapshot = await getDocs(collection(firestoreDB, "collections"));
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
    return NextResponse.json(hypixelData);
  } catch (err) {
    return new Response("Failed to fetch data", { status: 500 });
  }
}
