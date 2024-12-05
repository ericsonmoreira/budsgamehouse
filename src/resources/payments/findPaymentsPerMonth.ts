import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";
import { endOfMonth, startOfMonth } from "date-fns";

const path = "payments";

const paymentsCollectionRef = collection(firestore, path);

const findPaymentsPerMonth = async (month: Date) => {
  const firstDay = startOfMonth(month);

  const lastDay = endOfMonth(month);

  const q = query(
    paymentsCollectionRef,
    where("createdAt", ">=", firstDay),
    where("createdAt", "<=", lastDay),
    orderBy("createdAt", "desc"),
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Payment)];
};

export default findPaymentsPerMonth;
