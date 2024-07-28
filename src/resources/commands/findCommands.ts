import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';
import { endOfMonth, startOfMonth } from 'date-fns';

const path = 'commands';

const commandsCollectionRef = collection(firestore, path);

const findCommands = async (status: CommandStatus, month: Date) => {
  const firstDay = startOfMonth(month);

  const lastDay = endOfMonth(month);

  const q = query(
    commandsCollectionRef,
    where('status', '==', status),
    where('createdAt', '>=', firstDay.getTime()),
    where('createdAt', '<=', lastDay.getTime()),
    orderBy('createdAt', 'desc')
  );

  const { docs } = await getDocs(q);

  return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Command))];
};

export default findCommands;
