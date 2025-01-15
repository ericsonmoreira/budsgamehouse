import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const path = "expenses";

function useExpense(expenseId = "") {
  return useQuery<Expense>({
    queryKey: ["useExpense", expenseId],
    queryFn: async () => {
      const expenseDocRef = doc(firestore, path, expenseId);

      const expenseDocSnap = await getDoc(expenseDocRef);

      const id = expenseDocSnap.id;

      const data = expenseDocSnap.data();

      return { id, ...data } as Expense;
    },
    enabled: expenseId !== "",
  });
}

export default useExpense;
