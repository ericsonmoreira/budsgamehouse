import useReactQuery from "./useReactQuery";

function useProducts() {
  return useReactQuery<Product>({ path: "products", key: useProducts.name });
}

export default useProducts;
