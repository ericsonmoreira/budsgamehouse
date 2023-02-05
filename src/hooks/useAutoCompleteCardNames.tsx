import { useQuery } from "react-query";
import { Cards } from "scryfall-sdk";

// retorna uma lista de nomes de cartas de acordo com o nome passado na busca
function useAutoCompleteCardNames(value: string) {
  const { data: cardNames, ...rest } = useQuery(
    ["useAutoCompleteCardNames", value],
    async ({ queryKey }) => {
      const cardName = queryKey[1] as string;

      return await Cards.autoCompleteName(cardName);
    }
  );

  return { cardNames, ...rest };
}

export default useAutoCompleteCardNames;
