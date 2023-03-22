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

type TradingCardsData = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
};

type AddTradingCardsData = {
  imgUrl: string;
  name: string;
  amount: number;
};

function useTradingCards() {
  const queryClient = useQueryClient();

  const tradingCardsCollectionRef = collection(firestore, 'trading-cards');

  const { data: cards, ...rest } = useQuery('useTradingCards', async () => {
    const { docs } = await getDocs(tradingCardsCollectionRef);

    return [
      ...docs.map((doc) => ({ id: doc.id, ...doc.data() } as TradingCardsData)),
    ];
  });

  const { mutate: addTradingCard } = useMutation(
    async ({ name, amount, imgUrl }: AddTradingCardsData) => {
      const card = await addDoc(tradingCardsCollectionRef, {
        name,
        amount,
        imgUrl,
      });

      await queryClient.invalidateQueries('useTradingCards');

      return card;
    }
  );

  const { mutate: updateTradingCard } = useMutation(
    async ({ id, name, amount, imgUrl }: TradingCardsData) => {
      const cardDoc = doc(firestore, 'trading-cards', id);

      await updateDoc(cardDoc, { name, amount, imgUrl });

      await queryClient.invalidateQueries('useTradingCards');
    }
  );

  const { mutate: deleteTradingCard } = useMutation(async (id: string) => {
    const cardDoc = doc(firestore, 'trading-cards', id);

    await deleteDoc(cardDoc);

    await queryClient.invalidateQueries('useTradingCards');
  });

  return {
    cards,
    addTradingCard,
    updateTradingCard,
    deleteTradingCard,
    ...rest,
  };
}

export default useTradingCards;
