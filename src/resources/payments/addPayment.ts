import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "payments";

const paymentsCollectionRef = collection(firestore, path);

const addPayment = async (playerActivity: Omit<Payment, "id">) => {
  const paymentsDoc = await addDoc(paymentsCollectionRef, playerActivity);

  return paymentsDoc;
};

export default addPayment;
