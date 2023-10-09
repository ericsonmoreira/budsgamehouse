import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'expenses';

const expensesCollectionRef = collection(firestore, path);

const addExpense = async (expense: Omit<Expense, 'id'>) => {
  const expenseDoc = await addDoc(expensesCollectionRef, expense);

  return expenseDoc;
};

export default addExpense;
