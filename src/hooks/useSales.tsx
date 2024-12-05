import useReactQuery from "./useReactQuery";

function useSales() {
  return useReactQuery<Sale>({ path: "sales", key: useSales.name });
}

export default useSales;
