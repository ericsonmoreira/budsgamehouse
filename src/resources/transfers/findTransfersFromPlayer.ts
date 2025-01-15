import { firestore } from "@/services/firebaseConfig";
import {
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const path = "transfers";

const transfersCollectionRef = collection(firestore, path);

const findTransfersFromPlayer = async (playerId: string) => {
  const q = query(
    transfersCollectionRef,
    or(
      where("sendingPlayerId", "==", playerId),
      where("receiverPlayerId", "==", playerId),
    ),
    orderBy("createdAt", "desc"),
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sale)];
};

export default findTransfersFromPlayer;
