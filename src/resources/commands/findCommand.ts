import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'commands';

const findCommand = async (commandId: string) => {
  const commandDocRef = doc(firestore, path, commandId);

  const commandDocSnap = await getDoc(commandDocRef);

  const id = commandDocSnap.id;

  const data = commandDocSnap.data();

  return { id, ...data } as Command;
};

export default findCommand;
