import useReactQuery from './useReactQuery';

function useSales() {
  return useReactQuery<Product>({ path: 'sales', key: useSales.name });
}

export default useSales;
