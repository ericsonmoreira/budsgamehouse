import findSalesFromPlayer from "@/resources/sales/findSalesFromPlayer";
import { useQuery } from "@tanstack/react-query";

function useSalesFromPlayer(playerId = "") {
  return useQuery({
    queryKey: ["useSalesFromPlayer", playerId],
    queryFn: async () => await findSalesFromPlayer(playerId),
    enabled: playerId !== "",
  });
}

export default useSalesFromPlayer;
