import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { firestore } from "../services/firebaseConfig";

type UseWantedCardsData = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
};

type AddWantedCardData = {
  imgUrl: string;
  name: string;
  amount: number;
};

function useWantedCards() {
  const queryClient = useQueryClient();

  const wantedCardsCollectionRef = collection(firestore, "wanted-cards");

  const { data: cards, ...rest } = useQuery("useWantedCards", async () => {
    const { docs } = await getDocs(wantedCardsCollectionRef);

    return [
      ...docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UseWantedCardsData)
      ),
    ];
  });

  const { mutate: addWantedCard } = useMutation(
    async ({ name, amount, imgUrl }: AddWantedCardData) => {
      const card = await addDoc(wantedCardsCollectionRef, {
        name,
        amount,
        imgUrl,
      });

      await queryClient.invalidateQueries("useWantedCards");

      return card;
    }
  );

  const { mutate: deleteWantedCard } = useMutation(async (id: string) => {
    const cardDoc = doc(firestore, "wanted-cards", id);

    await deleteDoc(cardDoc);

    await queryClient.invalidateQueries("useWantedCards");
  });

  return { cards, addWantedCard, deleteWantedCard, ...rest };
}

export default useWantedCards;
