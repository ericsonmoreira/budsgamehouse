import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

const path = "sales";

function usePayments() {
  const paymentsCollectionRef = collection(firestore, path);

  return useQuery({
    queryKey: ["usePayments"],
    queryFn: async () => {
      const { docs } = await getDocs(paymentsCollectionRef);

      return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Payment)];
    },
  });
}

export default usePayments;
