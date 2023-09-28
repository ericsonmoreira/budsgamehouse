import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'sales';

const salesCollectionRef = collection(firestore, path);

const addSale = async (newSale: Omit<Sale, 'id'>) => {
  const sale = await addDoc(salesCollectionRef, newSale);

  return sale;
};

export default addSale;
