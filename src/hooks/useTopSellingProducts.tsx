import { useMemo } from 'react';
import useSales from './useSales';

type UseTopSellingProductsData = {
  id: string;
  amount: number;
  name: string;
};

function useTopSellingProducts() {
  const { data: sales } = useSales();

  const topSellingProducts = useMemo<UseTopSellingProductsData[]>(() => {
    if (sales) {
      const topSelling: UseTopSellingProductsData[] = [];

      for (const sale of sales) {
        for (const product of sale.products) {
          const { id, name, amount } = product;

          const elemIndex = topSelling.findIndex((elem) => elem.id === product.id);

          if (elemIndex < 0) {
            topSelling.push({ id, name, amount });
          } else {
            topSelling[elemIndex].amount += amount;
          }
        }
      }

      // ordenando por produtos mais vendidos
      return topSelling.sort((a, b) => b.amount - a.amount);
    }

    return [];
  }, [sales]);

  return topSellingProducts;
}

export default useTopSellingProducts;
