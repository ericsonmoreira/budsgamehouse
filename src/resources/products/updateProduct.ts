import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "products";

const updateProduct = async ({ id, imgUrl = "", ...rest }: Product) => {
  const productDoc = doc(firestore, path, id);

  await updateDoc(productDoc, { id, imgUrl, ...rest });
};

export default updateProduct;
