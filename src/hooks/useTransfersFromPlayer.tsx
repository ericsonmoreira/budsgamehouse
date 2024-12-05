import { useQuery } from "@tanstack/react-query";
import findTransfersFromPlayer from "../resources/transfers/findTransfersFromPlayer";

function useTransfersFromPlayer(playerId = "") {
  return useQuery({
    queryKey: [useTransfersFromPlayer, playerId],
    queryFn: async () => await findTransfersFromPlayer(playerId),
    enabled: playerId !== "",
  });
}

export default useTransfersFromPlayer;
