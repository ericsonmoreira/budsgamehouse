import { firestore } from "@/services/firebaseConfig";
import { endOfMonth, startOfMonth } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";

const path = "expenses";

const expensesCollectionRef = collection(firestore, path);

const findExpensesPerMonth = async (month: Date) => {
  const firstDay = startOfMonth(month);

  const lastDay = endOfMonth(month);

  const q = query(
    expensesCollectionRef,
    where("createdAt", ">=", firstDay),
    where("createdAt", "<=", lastDay),
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Expense)];
};

export default findExpensesPerMonth;
