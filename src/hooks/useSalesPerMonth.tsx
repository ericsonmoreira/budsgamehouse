import { useQuery } from '@tanstack/react-query';
import findSalesPerMonth from '../resources/sales/findSalesPerMonth';

const queryKey = 'useSalesPerMonth';

function useSalesPerMonth(month: Date) {
  return useQuery([queryKey, month], async () => await findSalesPerMonth(month));
}

export default useSalesPerMonth;
