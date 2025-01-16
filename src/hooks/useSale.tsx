import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const path = "sales";

function useSale(saleId = "") {
  return useQuery<Sale>({
    queryKey: ["useSale", saleId],
    queryFn: async () => {
      const docRef = doc(firestore, path, saleId);

      const saleDocSnap = await getDoc(docRef);

      const id = saleDocSnap.id;

      const data = saleDocSnap.data();

      return { id, ...data } as Sale;
    },
    enabled: saleId !== "",
  });
}

export default useSale;
