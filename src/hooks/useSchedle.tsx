import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

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
  });
}

export default useSchedle;
