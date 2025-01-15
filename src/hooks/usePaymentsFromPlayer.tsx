import findPaymentsFromPlayer from "@/resources/payments/findPaymentsFromPlayer";
import { useQuery } from "@tanstack/react-query";

function usePaymentsFromPlayer(playerId = "") {
  return useQuery({
    queryKey: ["usePaymentsFromPlayer", playerId],
    queryFn: async () => await findPaymentsFromPlayer(playerId),
    enabled: !!playerId,
  });
}

export default usePaymentsFromPlayer;
