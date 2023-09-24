import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'playerActivities';

const associatesCollectionRef = collection(firestore, path);

const addPlayerActivities = async (playerActivity: Omit<PlayerActivite, 'id'>) => {
  const playerActivitiesDoc = await addDoc(associatesCollectionRef, playerActivity);

  return playerActivitiesDoc;
};

export default addPlayerActivities;
