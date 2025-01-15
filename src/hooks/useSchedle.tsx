import { firestore } from "@/services/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const path = "schedules";

function useSchedle(schedleId = "") {
  return useQuery<Schedule>({
    queryKey: ["useSchedle", schedleId],
    queryFn: async () => {
      const docRef = doc(firestore, path, schedleId);

      const docSnap = await getDoc(docRef);

      const id = docSnap.id;

      const data = docSnap.data();

      return { id, ...data } as Schedule;
    },
    enabled: schedleId !== "",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

export default useSchedle;
