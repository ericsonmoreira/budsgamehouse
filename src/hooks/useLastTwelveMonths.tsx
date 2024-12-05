import { format, subMonths } from "date-fns";
import { useMemo } from "react";

function useLastTwelveMonths(quant: number) {
  // últimos 12 meses
  const lastTwelveMonths = useMemo(() => {
    const now = Date.now();

    const months: string[] = []; // MM/yyyy

    for (let i = 0; i < quant; i++) {
      const data = subMonths(now, i);

      const mesAno = format(data, "MM/yyyy");
      months.push(mesAno);
    }

    return months;
  }, [quant]);

  return lastTwelveMonths;
}

export default useLastTwelveMonths;
