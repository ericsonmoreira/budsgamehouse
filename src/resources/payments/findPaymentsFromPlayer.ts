import { firestore } from "@/services/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const path = "payments";

const paymentsCollectionRef = collection(firestore, path);

const findPaymentsFromPlayer = async (playerId: string) => {
  const q = query(
    paymentsCollectionRef,
    where("playerId", "==", playerId),
    orderBy("createdAt", "desc"),
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sale)];
};

export default findPaymentsFromPlayer;
