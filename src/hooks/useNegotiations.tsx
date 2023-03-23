import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { firestore } from '../services/firebaseConfig';

const path = 'negotiations';

const queryKey = 'useNegotiations';

function useNegotiations() {
  const queryClient = useQueryClient();

  const negotiationsCollectionRef = collection(firestore, path);

  const { data: negotiations, ...rest } = useQuery(queryKey, async () => {
    const { docs } = await getDocs(negotiationsCollectionRef);

    return [
      ...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Negotiation)),
    ];
  });

  const { mutate: addNegotiation } = useMutation(
    async ({
      description,
      status,
      price,
      associateId,
    }: Omit<Negotiation, 'id'>) => {
      const newNegotiation = await addDoc(negotiationsCollectionRef, {
        description,
        status,
        price,
        associateId,
      });

      await queryClient.invalidateQueries(queryKey);

      return newNegotiation;
    }
  );

  const { mutate: updateNegotiation } = useMutation(
    async ({ id, description, associateId, price, status }: Negotiation) => {
      const negotiationDoc = doc(firestore, path, id);

      await updateDoc(negotiationDoc, {
        id,
        description,
        associateId,
        price,
        status,
      });

      await queryClient.invalidateQueries(queryKey);
    }
  );

  const { mutate: deleteNegotiation } = useMutation(async (id: string) => {
    const negotiationDoc = doc(firestore, path, id);

    await deleteDoc(negotiationDoc);

    await queryClient.invalidateQueries(queryKey);
  });

  return {
    negotiations,
    addNegotiation,
    updateNegotiation,
    deleteNegotiation,
    ...rest,
  };
}

export default useNegotiations;
