import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const path = 'associates';

const queryKey = 'useAssociates';

function useAssociates() {
  const queryClient = useQueryClient();

  const associatesCollectionRef = collection(firestore, path);

  const { data: associates, ...rest } = useQuery([queryKey], async () => {
    const { docs } = await getDocs(associatesCollectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() } as Associate))];
  });

  const { mutate: addAssociate } = useMutation(async ({ name, phone }: Omit<Associate, 'id'>) => {
    const card = await addDoc(associatesCollectionRef, {
      name,
      phone,
    });

    await queryClient.invalidateQueries([queryKey]);

    return card;
  });

  const { mutate: updateAssociate } = useMutation(async ({ id, name, phone }: Associate) => {
    const associateDoc = doc(firestore, path, id);

    await updateDoc(associateDoc, { name, phone });

    await queryClient.invalidateQueries([queryKey]);
  });

  const { mutate: deleteAssociate } = useMutation(async (id: string) => {
    const associateDoc = doc(firestore, path, id);

    await deleteDoc(associateDoc);

    await queryClient.invalidateQueries([queryKey]);
  });

  return {
    associates,
    addAssociate,
    updateAssociate,
    deleteAssociate,
    ...rest,
  };
}

export default useAssociates;
