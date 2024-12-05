import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "players";

const playersCollectionRef = collection(firestore, path);

const findPlayerByEmail = async (playerEmail: string) => {
  const q = query(playersCollectionRef, where("email", "==", playerEmail));

  const { docs } = await getDocs(q);

  if (docs[0]) {
    return { id: docs[0].id, ...docs[0].data } as Player;
  }

  return undefined;
};

export default findPlayerByEmail;
