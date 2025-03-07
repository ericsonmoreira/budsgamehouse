import { firestore } from "@/services/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const path = "playerActivities";

const associatesCollectionRef = collection(firestore, path);

const addPlayerActivities = async (
  playerActivity: Omit<PlayerActivite, "id">,
) => {
  const playerActivitiesDoc = await addDoc(
    associatesCollectionRef,
    playerActivity,
  );

  return playerActivitiesDoc;
};

export default addPlayerActivities;
