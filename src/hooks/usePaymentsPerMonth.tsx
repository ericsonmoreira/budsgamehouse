import { useQuery } from '@tanstack/react-query';
import findPaymentsPerMonth from '../resources/payments/findPaymentsPerMonth';

const queryKey = 'usePaymentsPerMonth';

function usePaymentsPerMonth(month: Date) {
  return useQuery([queryKey, month], async () => await findPaymentsPerMonth(month));
}

export default usePaymentsPerMonth;
