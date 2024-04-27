import { useQuery } from '@tanstack/react-query';
import findCommands from '../resources/commands/findCommands';

function useCommands(status: CommandStatus) {
  return useQuery({ queryKey: ['useCommands', status], queryFn: async () => await findCommands(status) });
}

export default useCommands;
