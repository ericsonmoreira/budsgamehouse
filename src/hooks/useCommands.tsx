import findCommands from "@/resources/commands/findCommands";
import { useQuery } from "@tanstack/react-query";

function useCommands(status: CommandStatus, month: Date) {
  return useQuery({
    queryKey: ["useCommands", status, month],
    queryFn: async () => await findCommands(status, month),
  });
}

export default useCommands;
