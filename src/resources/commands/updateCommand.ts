import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../services/firebaseConfig";

const path = "commands";

const updateCommand = async ({ id, ...rest }: Command) => {
  const comandDoc = doc(firestore, path, id);

  await updateDoc(comandDoc, { id, ...rest });
};

export default updateCommand;
