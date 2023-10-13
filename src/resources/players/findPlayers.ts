import { collection, endAt, getDocs, query, startAt } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'players';

const collectionRef = collection(firestore, path);

const findPlayers = async () => {
  const q = query(collectionRef, startAt(1), endAt(10));

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player))];
};

export default findPlayers;
