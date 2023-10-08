import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'commands';

const commandsCollectionRef = collection(firestore, path);

const findCommands = async (status: CommandStatus) => {
  const q = query(commandsCollectionRef, where('status', '==', status), orderBy('createdAt', 'desc'));

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Command))];
};

export default findCommands;
