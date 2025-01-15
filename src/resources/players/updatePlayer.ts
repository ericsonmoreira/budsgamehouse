import { firestore } from "@/services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const path = "players";

const updatePlayer = async ({ id, avatarImgUrl = "", ...rest }: Player) => {
  const playerDoc = doc(firestore, path, id);

  await updateDoc(playerDoc, { id, avatarImgUrl, ...rest });
};

export default updatePlayer;
