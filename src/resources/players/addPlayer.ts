import { firestore } from "@/services/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const path = "players";

const playersCollectionRef = collection(firestore, path);

const addPlayer = async ({
  avatarImgUrl = "",
  ...rest
}: Omit<Player, "id">) => {
  const card = await addDoc(playersCollectionRef, {
    avatarImgUrl,
    ...rest,
  });

  return card;
};

export default addPlayer;
