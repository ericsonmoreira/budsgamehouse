import { useQuery } from '@tanstack/react-query';
import findExpensesPerMonth from '../resources/expenses/findExpensesPerMonth';

const queryKey = 'useExpensesPerMonth';

function useExpensesPerMonth(month: Date) {
  return useQuery([queryKey, month], async () => await findExpensesPerMonth(month));
}

export default useExpensesPerMonth;
