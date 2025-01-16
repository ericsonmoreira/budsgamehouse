import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const path = "products";

function useProduct(productId = "") {
  return useQuery<Product>({
    queryKey: ["useProduct", productId],
    queryFn: async () => {
      const docRef = doc(firestore, path, productId);

      const docSnap = await getDoc(docRef);

      const id = docSnap.id;

      const data = docSnap.data();

      return { id, ...data } as Product;
    },
    enabled: productId !== "",
  });
}

export default useProduct;
