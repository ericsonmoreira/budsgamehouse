import { firestore } from "@/services/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const path = "payments";

const paymentsCollectionRef = collection(firestore, path);

const addPayment = async (playerActivity: Omit<Payment, "id">) => {
  const paymentsDoc = await addDoc(paymentsCollectionRef, playerActivity);

  return paymentsDoc;
};

export default addPayment;
