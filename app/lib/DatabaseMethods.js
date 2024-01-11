import { doc, getDoc, setDoc, collection, getDocs, where, query } from "firebase/firestore";
// Fetch Profile
export async function fetchProfile(firestore, UUID, isAdmin) {
  if (isAdmin) {
    return (await firestore.collection("profileData").doc(UUID).get()).data();
  } else {
    const profileDocRef = doc(firestore, "profileData", UUID);
    const profileSnapshot = await getDoc(profileDocRef);
    return profileSnapshot.data();
  }
}

// Set Profile
export async function setProfile(firestore, UUID, data, isAdmin) {
  if (isAdmin) {
    await firestore.collection("profileData").doc(UUID).set(data);
  } else {
    const profileDocRef = doc(firestore, "profileData", UUID);
    await setDoc(profileDocRef, data);
  }
}

// Get Collection
export async function getCollection(firestore, collectionName, isAdmin) {
  if (isAdmin) {
    return await firestore.collection(collectionName).get();
  } else {
    return await getDocs(collection(firestore, collectionName));
  }
}

export async function getUUID(firestore, profileName, isAdmin) {
  const uuidCollectionRef = isAdmin ? firestore.collection("profileData") : collection(firestore, "profileData");
  let queryResults = [];
  if (isAdmin) {
    queryResults = await uuidCollectionRef.where("name", "==", profileName).get();
    if (queryResults.empty) return null;
  } else {
    const q = query(uuidCollectionRef, where("name", "==", profileName));
    queryResults = await getDocs(q);
  }
  
  const uuid = queryResults.docs.map((doc) => doc.id);
  return uuid[0];
}