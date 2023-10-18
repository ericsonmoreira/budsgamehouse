import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'schedules';

const schedulesCollectionRef = collection(firestore, path);

const addSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
  const schedule = await addDoc(schedulesCollectionRef, newSchedule);

  return schedule;
};

export default addSchedule;
