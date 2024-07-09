import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'commands';

const commandsCollectionRef = collection(firestore, path);

const addCommand = async (command: Omit<Command, 'id'>) => {
  const commandDoc = await addDoc(commandsCollectionRef, command);

  return commandDoc;
};

export default addCommand;
