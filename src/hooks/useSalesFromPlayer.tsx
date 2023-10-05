import { useQuery } from '@tanstack/react-query';
import findSalesFromPlayer from '../resources/sales/findSalesFromPlayer';

const queryKey = 'useSalesFromPlayer';

function useSalesFromPlayer(playerId = '') {
  return useQuery([queryKey, playerId], async () => await findSalesFromPlayer(playerId), { enabled: playerId !== '' });
}

export default useSalesFromPlayer;
