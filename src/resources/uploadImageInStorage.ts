import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../services/firebaseConfig';

const uploadImageInStorage = async (image: File) => {
  const storageRef = ref(storage, `images/${image.name + Date.now()}`);

  await uploadBytes(storageRef, image);

  return await getDownloadURL(storageRef);
};

export default uploadImageInStorage;
