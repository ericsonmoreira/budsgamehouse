import { useQuery } from "@tanstack/react-query";
import findCommands from "../resources/commands/findCommands";

function useCommands(status: CommandStatus, month: Date) {
  return useQuery({
    queryKey: ["useCommands", status, month],
    queryFn: async () => await findCommands(status, month),
  });
}

export default useCommands;
