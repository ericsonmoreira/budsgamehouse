import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'products';

const associatesCollectionRef = collection(firestore, path);

const addProduct = async ({ name, category, price, imgUrl = '' }: Omit<Product, 'id'>) => {
  const card = await addDoc(associatesCollectionRef, {
    name,
    category,
    price,
    imgUrl,
  });

  return card;
};

export default addProduct;
