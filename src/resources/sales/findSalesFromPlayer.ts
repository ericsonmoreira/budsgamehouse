import { firestore } from "@/services/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

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
