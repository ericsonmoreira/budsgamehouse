import { useQuery } from '@tanstack/react-query';
import findPaymentsFromPlayer from '../resources/payments/findPaymentsFromPlayer';

function usePaymentsFromPlayer(playerId = '') {
  return useQuery({
    queryKey: ['usePaymentsFromPlayer', playerId],
    queryFn: async () => await findPaymentsFromPlayer(playerId),
    enabled: !!playerId,
  });
}

export default usePaymentsFromPlayer;
