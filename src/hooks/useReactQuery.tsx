import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

type UseReactQueryData = {
  path: string;
  key: string;
};

function useReactQuery<T>({ path, key }: UseReactQueryData) {
  const salesCollectionRef = collection(firestore, path);

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { docs } = await getDocs(salesCollectionRef);

      return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)];
    },
  });
}

export default useReactQuery;
