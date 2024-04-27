import { useQuery } from '@tanstack/react-query';
import findPaymentsPerMonth from '../resources/payments/findPaymentsPerMonth';

function usePaymentsPerMonth(month: Date) {
  return useQuery({ queryKey: ['usePaymentsPerMonth', month], queryFn: async () => await findPaymentsPerMonth(month) });
}

export default usePaymentsPerMonth;
