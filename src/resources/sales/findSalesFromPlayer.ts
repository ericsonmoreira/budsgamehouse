import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "sales";

const salesCollectionRef = collection(firestore, path);

const findSalesFromPlayer = async (playerId: string) => {
  const q = query(
    salesCollectionRef,
    where("playerId", "==", playerId),
    orderBy("createdAt", "desc"),
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sale)];
};

export default findSalesFromPlayer;
