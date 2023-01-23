import { useQuery } from "react-query";
import { Cards } from "scryfall-sdk";

function useAutoCompleteCardNames(value: string) {
  const { data: cardNames, ...rest } = useQuery(
    ["useAutoCompleteCardNames", value],
    ({ queryKey }) => Cards.autoCompleteName(queryKey[1])
  );

  return { cardNames, ...rest };
}

export default useAutoCompleteCardNames;
