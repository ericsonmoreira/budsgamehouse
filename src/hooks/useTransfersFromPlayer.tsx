import findTransfersFromPlayer from "@/resources/transfers/findTransfersFromPlayer";
import { useQuery } from "@tanstack/react-query";

function useTransfersFromPlayer(playerId = "") {
  return useQuery({
    queryKey: [useTransfersFromPlayer, playerId],
    queryFn: async () => await findTransfersFromPlayer(playerId),
    enabled: playerId !== "",
  });
}

export default useTransfersFromPlayer;
