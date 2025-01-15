import findSalesPerMonth from "@/resources/sales/findSalesPerMonth";
import { useQuery } from "@tanstack/react-query";

function useSalesPerMonth(month: Date) {
  return useQuery({
    queryKey: ["useSalesPerMonth", month],
    queryFn: async () => await findSalesPerMonth(month),
  });
}

export default useSalesPerMonth;
