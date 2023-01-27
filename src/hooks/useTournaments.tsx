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

type TournamentsData = {
  id: string;
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  data: string;
};

type AddTournamentsData = {
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  data: string;
};

function useTournaments() {
  const queryClient = useQueryClient();

  const tradingCardsCollectionRef = collection(firestore, "tournaments");

  const { data: tournaments, ...rest } = useQuery(
    "useTournaments",
    async () => {
      const { docs } = await getDocs(tradingCardsCollectionRef);

      return [
        ...docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as TournamentsData)
        ),
      ];
    }
  );

  const { mutate: addTournament } = useMutation(
    async (tournament: AddTournamentsData) => {
      const tournamentDoc = await addDoc(tradingCardsCollectionRef, tournament);

      await queryClient.invalidateQueries("useTournaments");

      return tournamentDoc;
    }
  );

  const { mutate: updateTournament } = useMutation(
    async (tournament: TournamentsData) => {
      const tournamentDoc = doc(firestore, "tournaments", tournament.id);

      await updateDoc(tournamentDoc, tournament);

      await queryClient.invalidateQueries("useTournaments");
    }
  );

  const { mutate: deleteTournament } = useMutation(async (id: string) => {
    const tournamentDoc = doc(firestore, "tournaments", id);

    await deleteDoc(tournamentDoc);

    await queryClient.invalidateQueries("useTournaments");
  });

  return {
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    ...rest,
  };
}

export default useTournaments;
