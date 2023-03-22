import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { firestore } from '../services/firebaseConfig';

type AddTournamentsData = {
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  data: string;
};

function useTournaments() {
  const queryClient = useQueryClient();

  const tradingCardsCollectionRef = collection(firestore, 'tournaments');

  const { data: tournaments, ...rest } = useQuery(
    'useTournaments',
    async () => {
      const { docs } = await getDocs(tradingCardsCollectionRef);

      return [
        ...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Tournament)),
      ];
    }
  );

  const findTournament = (id: string | undefined) =>
    useQuery(['useTournaments', id], async () => {
      if (!id) return null;

      const tournamentDoc = doc(firestore, 'tournaments', id);

      const docSnap = await getDoc(tournamentDoc);

      return { id: docSnap.id, ...docSnap.data() } as Tournament;
    });

  const { mutate: addTournament } = useMutation(
    async (tournament: AddTournamentsData) => {
      const tournamentDoc = await addDoc(tradingCardsCollectionRef, tournament);

      await queryClient.invalidateQueries('useTournaments');

      const docSnap = await getDoc(tournamentDoc);

      return { id: docSnap.id, ...docSnap.data() } as Tournament;
    }
  );

  const { mutate: updateTournament } = useMutation(
    async (tournament: Tournament) => {
      const tournamentDoc = doc(firestore, 'tournaments', tournament.id);

      await updateDoc(tournamentDoc, tournament);

      await queryClient.invalidateQueries('useTournaments');
    }
  );

  const { mutate: deleteTournament } = useMutation(async (id: string) => {
    const tournamentDoc = doc(firestore, 'tournaments', id);

    await deleteDoc(tournamentDoc);

    await queryClient.invalidateQueries('useTournaments');
  });

  return {
    tournaments,
    findTournament,
    addTournament,
    updateTournament,
    deleteTournament,
    ...rest,
  };
}

export default useTournaments;
