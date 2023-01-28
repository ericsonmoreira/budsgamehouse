import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { firestore } from "../services/firebaseConfig";

export type PlayerData = {
  id: string;
  name: string;
  email: string;
};

type AddPlayerData = {
  name: string;
  email: string;
};

function usePlayers() {
  const queryClient = useQueryClient();

  const tradingCardsCollectionRef = collection(firestore, "players");

  const { data: players, ...rest } = useQuery("usePlayers", async () => {
    const { docs } = await getDocs(tradingCardsCollectionRef);

    return [
      ...docs.map((doc) => ({ id: doc.id, ...doc.data() } as PlayerData)),
    ];
  });

  const { mutate: addPlayer } = useMutation(
    async ({ name, email }: AddPlayerData) => {
      const card = await addDoc(tradingCardsCollectionRef, {
        name,
        email,
      });

      await queryClient.invalidateQueries("usePlayers");

      return card;
    }
  );

  const { mutate: updatePlayer } = useMutation(
    async ({ id, name, email }: PlayerData) => {
      const cardDoc = doc(firestore, "players", id);

      await updateDoc(cardDoc, { name, email });

      await queryClient.invalidateQueries("usePlayers");
    }
  );

  const { mutate: deletePlayer } = useMutation(async (id: string) => {
    const cardDoc = doc(firestore, "players", id);

    await deleteDoc(cardDoc);

    await queryClient.invalidateQueries("usePlayers");
  });

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer,
    ...rest,
  };
}

export default usePlayers;
