import { useQuery } from '@tanstack/react-query';
import findSalesFromPlayer from '../resources/sales/findSalesFromPlayer';

const queryKey = 'useSalesFromPlayer';

function useSalesFromPlayer(playerId: string) {
  return useQuery([queryKey, playerId], async () => await findSalesFromPlayer(playerId));
}

export default useSalesFromPlayer;
