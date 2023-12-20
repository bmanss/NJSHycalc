// import { getHypixelData } from "../lib/Util.jsx";
import { cacheHypixelData } from "../LocalTesting/cacheHypixelData";
import Profile from "../Components/Profile";

const ProfilePage = async () => {
  const hypixelData = await cacheHypixelData();
  console.log('server');
  const sortItem = async () =>{
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
  }
  const sortedItems = await sortItem();
  
  return (
    <div>
      <Profile sortedItems={sortedItems} skillsCaps={hypixelData.skillCaps}/>
    </div>
  );
};

export default ProfilePage;
