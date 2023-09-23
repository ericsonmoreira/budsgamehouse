import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'fiados';

const deleteFiado = async (id: string) => {
  const fiadoDoc = doc(firestore, path, id);

  await deleteDoc(fiadoDoc);
};

export default deleteFiado;
