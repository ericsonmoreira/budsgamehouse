import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'fiados';

const queryKey = 'useFiados';

function useFiados() {
  const associatesCollectionRef = collection(firestore, path);

  return useQuery([queryKey], async () => {
    const { docs } = await getDocs(associatesCollectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Fiado))];
  });
}

export default useFiados;
