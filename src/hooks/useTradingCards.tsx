import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

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

  const tradingCardsCollectionRef = collection(firestore, "trading-cards");

  const { data: cards, ...rest } = useQuery({
    queryKey: ["useTradingCards"],
    queryFn: async () => {
      const { docs } = await getDocs(tradingCardsCollectionRef);

      return [
        ...docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as TradingCardsData,
        ),
      ];
    },
  });

  const { mutate: addTradingCard } = useMutation({
    mutationFn: async ({ name, amount, imgUrl }: AddTradingCardsData) => {
      const card = await addDoc(tradingCardsCollectionRef, {
        name,
        amount,
        imgUrl,
      });

      await queryClient.invalidateQueries({ queryKey: ["useTradingCards"] });

      return card;
    },
  });

  const { mutate: updateTradingCard } = useMutation({
    mutationFn: async ({ id, name, amount, imgUrl }: TradingCardsData) => {
      const cardDoc = doc(firestore, "trading-cards", id);

      await updateDoc(cardDoc, { name, amount, imgUrl });

      await queryClient.invalidateQueries({ queryKey: ["useTradingCards"] });
    },
  });

  const { mutate: deleteTradingCard } = useMutation({
    mutationFn: async (id: string) => {
      const cardDoc = doc(firestore, "trading-cards", id);

      await deleteDoc(cardDoc);

      await queryClient.invalidateQueries({ queryKey: ["useTradingCards"] });
    },
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
