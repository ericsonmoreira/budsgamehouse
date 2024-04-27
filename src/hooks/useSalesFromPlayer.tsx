import { useQuery } from '@tanstack/react-query';
import findSalesFromPlayer from '../resources/sales/findSalesFromPlayer';

function useSalesFromPlayer(playerId = '') {
  return useQuery({
    queryKey: ['useSalesFromPlayer', playerId],
    queryFn: async () => await findSalesFromPlayer(playerId),
    enabled: playerId !== '',
  });
}

export default useSalesFromPlayer;
