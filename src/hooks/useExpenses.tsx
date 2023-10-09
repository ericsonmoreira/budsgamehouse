import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'expenses';

const queryKey = 'useExpenses';

function useExpenses() {
  const expensesCollectionRef = collection(firestore, path);

  return useQuery([queryKey], async () => {
    const { docs } = await getDocs(expensesCollectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense))];
  });
}

export default useExpenses;
