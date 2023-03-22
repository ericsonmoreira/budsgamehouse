import { useQuery } from 'react-query';
import { Card, Cards } from 'scryfall-sdk';

function useCardByName(value: string) {
  const { data: card, ...rest } = useQuery<Card | null>(
    ['useCardByName', value],
    async ({ queryKey }) => {
      if (queryKey[1] === '') return null;

      const cardName = queryKey[1] as string;

      const card: Card = await Cards.byName(cardName);

      return card;
    }
  );

  return { card, ...rest };
}

export default useCardByName;
