import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'fiados';

const associatesCollectionRef = collection(firestore, path);

const addFiado = async ({ playerId, value }: Omit<Fiado, 'id'>) => {
  const card = await addDoc(associatesCollectionRef, {
    playerId,
    value,
  });

  return card;
};

export default addFiado;
