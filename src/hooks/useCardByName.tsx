import { useQuery } from "react-query";
import { Cards } from "scryfall-sdk";

function useCardByName(value: string) {
  const { data: card, ...rest } = useQuery(
    ["useAutoCompleteCardNames", value],
    ({ queryKey }) => (queryKey[1] !== "" ? Cards.byName(queryKey[1]) : null)
  );

  return { card, ...rest };
}

export default useCardByName;
