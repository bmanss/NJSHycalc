'use client'
import styles from "./styles/homePage.module.scss";
import { ProfileProvider } from "./context/ProfileContext";
import HomeDisplayItems from "./Components/HomeDisplayItems";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { updateDatabaseItems } from "./LocalTesting/updateDatabaseItems";
import LoadingSkeleton from "./Components/LoadingSkeleton"

  // updateDatabaseItems();
export default function Home() {
  const router = useRouter();
  const playerName = useRef(''); 

  // use loading screen here not sure why loading page does not come into effect on route
  const [loading,setLoading] = useState(false);

  const loadProfile = (e) =>{
    e.preventDefault();
    setLoading(true);
    router.push(`/profile/${playerName.current}`);
  }

  const loadDefault = async (e) =>{
    e.preventDefault();
    setLoading(true);
    router.push(`/profile/`);
  }

  useEffect(() =>{
    setLoading(false);
  },[]);

  useEffect(() =>{
    router.prefetch(`/profile`);
  },[router])

  if (loading){
    return <LoadingSkeleton/>
  }
  else {
    return (
      <main className={styles.main}>
        <h1 className={styles.headerText}>HyCalc</h1>
        <form className={styles.profileSearch} onSubmit={(e) => loadProfile(e)}>
          <input onChange={(e) => playerName.current = e.target.value} placeholder='Player Name' type='text' />
          <button>Load</button>
          <button onClick={(e) =>loadDefault(e)}>No Profile</button>
        </form>
        <div>
          <ProfileProvider>
            <HomeDisplayItems />
          </ProfileProvider>
        </div>
      </main>
    );
  }

}
