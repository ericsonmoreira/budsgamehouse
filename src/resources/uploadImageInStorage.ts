import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import reduce from 'image-blob-reduce';
import { storage } from '../services/firebaseConfig';

const uploadImageInStorage = async (image: File) => {
  const reduceImage = await reduce().toBlob(image, { max: 200 });

  const storageRef = ref(storage, `images/${image.name + Date.now()}`);

  await uploadBytes(storageRef, reduceImage);

  return await getDownloadURL(storageRef);
};

export default uploadImageInStorage;
