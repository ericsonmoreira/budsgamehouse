import { useQuery } from '@tanstack/react-query';
import findTransfersFromPlayer from '../resources/transfers/findTransfersFromPlayer';

const queryKey = 'useTransfersFromPlayer';

function useTransfersFromPlayer(playerId = '') {
  return useQuery([queryKey, playerId], async () => await findTransfersFromPlayer(playerId), {
    enabled: playerId !== '',
  });
}

export default useTransfersFromPlayer;
