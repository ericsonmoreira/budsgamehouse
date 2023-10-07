import { useQuery } from '@tanstack/react-query';
import findCommands from '../resources/commands/findCommands';

function useCommands(status: CommandStatus) {
  return useQuery(['useCommands', status], async () => await findCommands(status));
}

export default useCommands;
