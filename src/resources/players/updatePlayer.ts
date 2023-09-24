import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

const path = 'players';

const updatePlayer = async ({ id, avatarImgUrl = '', ...rest }: Player) => {
  const playerDoc = doc(firestore, path, id);

  await updateDoc(playerDoc, { id, avatarImgUrl, ...rest });
};

export default updatePlayer;
