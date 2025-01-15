import findExpensesPerMonth from "@/resources/expenses/findExpensesPerMonth";
import { useQuery } from "@tanstack/react-query";

function useExpensesPerMonth(month: Date) {
  return useQuery({
    queryKey: ["useExpensesPerMonth", month],
    queryFn: async () => await findExpensesPerMonth(month),
  });
}

export default useExpensesPerMonth;
