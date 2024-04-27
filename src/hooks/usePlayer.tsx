import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'players';

function usePlayer(userId = '') {
  return useQuery<Player>({
    queryKey: ['usePlayer', userId],
    queryFn: async () => {
      const playerDocRef = doc(firestore, path, userId);

      const playerDocSnap = await getDoc(playerDocRef);

      const id = playerDocSnap.id;

      const data = playerDocSnap.data();

      return { id, ...data } as Player;
    },
    enabled: userId !== '',
  });
}

export default usePlayer;
