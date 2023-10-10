import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'expenses';

const queryKey = 'useExpense';

function useExpense(expenseId = '') {
  return useQuery<Expense>(
    [queryKey, expenseId],
    async () => {
      const expenseDocRef = doc(firestore, path, expenseId);

      const expenseDocSnap = await getDoc(expenseDocRef);

      const id = expenseDocSnap.id;

      const data = expenseDocSnap.data();

      return { id, ...data } as Expense;
    },
    {
      enabled: expenseId !== '',
    }
  );
}

export default useExpense;
