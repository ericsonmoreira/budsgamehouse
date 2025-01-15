import { firestore } from "@/services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const path = "schedules";

const updateSchedule = async ({ id, ...rest }: Schedule) => {
  const scheduleDoc = doc(firestore, path, id);

  await updateDoc(scheduleDoc, { id, ...rest });
};

export default updateSchedule;
