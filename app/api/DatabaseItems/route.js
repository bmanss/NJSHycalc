import serviceAccount from "@/firebaseServiceCred";
import admin from "firebase-admin";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getCollection } from "@/app/lib/DatabaseMethods";
import { getLocalFirestore } from "@/app/firestoreConfig";
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
    // const firestoreDB = admin.firestore();
    const useAdminDB = process.env.NODE_ENV === "production";
    const firestoreDB = useAdminDB ? admin.firestore() : getLocalFirestore();

    const itemSnapshot = await getCollection(firestoreDB, "items", useAdminDB);
    const skillsSnapshot = await getCollection(firestoreDB, "skills", useAdminDB);
    const collectionsSnapshot = await getCollection(firestoreDB, "collections", useAdminDB);
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
    hypixelData.lastUpdated = time.toUTCString();
    return new Response(JSON.stringify(hypixelData), {
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
