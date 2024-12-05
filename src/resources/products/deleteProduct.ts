import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "products";

const deleteProduct = async (id: string) => {
  const productDoc = doc(firestore, path, id);

  await deleteDoc(productDoc);
};

export default deleteProduct;
