import { useQuery } from '@tanstack/react-query';
import findPaymentsFromPlayer from '../resources/payments/findPaymentsFromPlayer';

const queryKey = 'usePaymentsFromPlayer';

function usePaymentsFromPlayer(playerId = '') {
  return useQuery([queryKey, playerId], async () => await findPaymentsFromPlayer(playerId), {
    enabled: !!playerId,
  });
}

export default usePaymentsFromPlayer;
