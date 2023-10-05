import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

const path = 'players';

const queryKey = 'usePlayer';

function usePlayer(userId = '') {
  return useQuery<Player>(
    [queryKey, userId],
    async () => {
      const playerDocRef = doc(firestore, path, userId);

      const playerDocSnap = await getDoc(playerDocRef);

      const id = playerDocSnap.id;

      const data = playerDocSnap.data();

      return { id, ...data } as Player;
    },
    {
      enabled: userId !== '',
    }
  );
}

export default usePlayer;
