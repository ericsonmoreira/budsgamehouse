import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "transfers";

const transfersCollectionRef = collection(firestore, path);

const addTransfer = async (newSale: Omit<Transfer, "id">) => {
  const transfer = await addDoc(transfersCollectionRef, newSale);

  return transfer;
};

export default addTransfer;
