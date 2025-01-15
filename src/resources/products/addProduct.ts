import { firestore } from "@/services/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const path = "products";

const associatesCollectionRef = collection(firestore, path);

const addProduct = async ({ imgUrl = "", ...rest }: Omit<Product, "id">) => {
  const card = await addDoc(associatesCollectionRef, {
    imgUrl,
    ...rest,
  });

  return card;
};

export default addProduct;
