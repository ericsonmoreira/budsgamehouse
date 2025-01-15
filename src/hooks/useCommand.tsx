import findCommand from "@/resources/commands/findCommand";
import { useQuery } from "@tanstack/react-query";

function useCommand(commandId = "") {
  return useQuery({
    queryKey: ["useCommand", commandId],
    queryFn: async () => await findCommand(commandId),
    enabled: commandId !== "",
  });
}

export default useCommand;
