'use client'
import styles from "./styles/homePage.module.scss";
import { ProfileProvider } from "./context/ProfileContext";
import HomeDisplayItems from "./Components/HomeDisplayItems";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
export default function Home() {
  const router = useRouter();
  const playerName = useRef(''); 
  const loadProfile = (e) =>{
    e.preventDefault();
    router.push(`/profile/${playerName.current}`);
  }

  const loadDefault = async (e) =>{
    e.preventDefault();
    router.push(`/profile/`);
  }

  useEffect(() =>{
    router.prefetch(`/profile`);
  },[router])

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
