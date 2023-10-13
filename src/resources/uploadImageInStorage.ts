import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../services/firebaseConfig';

import reduce from 'image-blob-reduce';

const uploadImageInStorage = async (image: File) => {
  const reduceImage = await reduce().toBlob(image, { max: 200 });

  const storageRef = ref(storage, `images/${image.name + Date.now()}`);

  await uploadBytes(storageRef, reduceImage);

  return await getDownloadURL(storageRef);
};

export default uploadImageInStorage;
