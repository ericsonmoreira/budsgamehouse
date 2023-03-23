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

function useWantedCards() {
  const queryClient = useQueryClient();

  const wantedCardsCollectionRef = collection(firestore, 'wanted-cards');

  const { data: cards, ...rest } = useQuery('useWantedCards', async () => {
    const { docs } = await getDocs(wantedCardsCollectionRef);

    return [
      ...docs.map((doc) => ({ id: doc.id, ...doc.data() } as WantedCard)),
    ];
  });

  const { mutate: addWantedCard } = useMutation(
    async (newWantedCard: Omit<WantedCard, 'id'>) => {
      const card = await addDoc(wantedCardsCollectionRef, newWantedCard);

      await queryClient.invalidateQueries('useWantedCards');

      return card;
    }
  );

  const { mutate: updateWantedCard } = useMutation(
    async ({ id, name, amount, imgUrl, priority }: WantedCard) => {
      const cardDoc = doc(firestore, 'wanted-cards', id);

      await updateDoc(cardDoc, { name, amount, imgUrl, priority });

      await queryClient.invalidateQueries('useWantedCards');
    }
  );

  const { mutate: deleteWantedCard } = useMutation(async (id: string) => {
    const cardDoc = doc(firestore, 'wanted-cards', id);

    await deleteDoc(cardDoc);

    await queryClient.invalidateQueries('useWantedCards');
  });

  return { cards, addWantedCard, updateWantedCard, deleteWantedCard, ...rest };
}

export default useWantedCards;
