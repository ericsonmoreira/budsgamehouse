import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import { useQuery } from '@tanstack/react-query';

const path = 'products';

const queryKey = 'useProducts';

function useProducts() {
  const associatesCollectionRef = collection(firestore, path);

  return useQuery([queryKey], async () => {
    const { docs } = await getDocs(associatesCollectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))];
  });
}

export default useProducts;
