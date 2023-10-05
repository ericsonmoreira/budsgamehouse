import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'sales';

const queryKey = 'usePayments';

function usePayments() {
  const paymentsCollectionRef = collection(firestore, path);

  return useQuery([queryKey], async () => {
    const { docs } = await getDocs(paymentsCollectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Payment))];
  });
}

export default usePayments;
