import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";

export async function fetchProfile(firestore, UUID) {
  const profileDocRef = doc(firestore, "profileData", UUID);
  const profileSnapshot = await getDoc(profileDocRef);
  return profileSnapshot.data();
}

export async function fetchProfileWithAdmin(adminFirestore,UUID) {
  const data = (await adminFirestore.collection("profileData").doc(UUID).get()).data();
  return data;
}

export function setProfile(firestore, UUID, data) {
  const profileDocRef = doc(firestore, "profileData", UUID);
  setDoc(profileDocRef, data);
}

export async function setProfileWithAdmin(adminFirestore, UUID, data) {
    adminFirestore.collection("profileData").doc(UUID).set(data);
}

export async function getCollection(firestoreDB,collectionName){
    return await getDocs(collection(firestoreDB, collectionName));
}

export async function getCollectionWithAdmin(firestoreDB,collectionName){
    return await firestoreDB.collection(collectionName).get();
}
