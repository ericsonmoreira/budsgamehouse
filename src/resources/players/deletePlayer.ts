import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'players';

const deletePlayer = async (id: string) => {
  const playerDoc = doc(firestore, path, id);

  await deleteDoc(playerDoc);
};

export default deletePlayer;
