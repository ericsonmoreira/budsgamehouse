import { useQuery } from '@tanstack/react-query';
import findSalesPerMonth from '../resources/sales/findSalesPerMonth';

function useSalesPerMonth(month: Date) {
  return useQuery({ queryKey: ['useSalesPerMonth', month], queryFn: async () => await findSalesPerMonth(month) });
}

export default useSalesPerMonth;
