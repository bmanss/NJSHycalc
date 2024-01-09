import styles from "./styles/homePage.module.scss";
import { ProfileProvider } from "./context/ProfileContext";
import HomeDisplayItems from "./Components/HomeDisplayItems";
import HomeSearchForm from "./Components/HomeSearchForm";
import { updateDatabaseItems } from "./LocalTesting/updateDatabaseItems";
// updateDatabaseItems();
export default async function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.headerText}>HyCalc</h1>
      <HomeSearchForm />
      <div>
        <ProfileProvider>
          <HomeDisplayItems />
        </ProfileProvider>
      </div>
    </main>
  );
}
