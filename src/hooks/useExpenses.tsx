import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

const path = "expenses";

const queryKey = "useExpenses";

function useExpenses() {
  const expensesCollectionRef = collection(firestore, path);

  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { docs } = await getDocs(expensesCollectionRef);

      return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Expense)];
    },
  });
}

export default useExpenses;
