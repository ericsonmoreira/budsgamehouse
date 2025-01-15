import { firestore } from "@/services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const path = "products";

const updateProductStock = async (id: string, value: number) => {
  const productDoc = doc(firestore, path, id);

  const productSnap = await getDoc(productDoc);

  const data = productSnap.data();

  const product = { id, ...data } as Product;

  await updateDoc(productDoc, { ...product, stock: product.stock + value });
};

export default updateProductStock;
