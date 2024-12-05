import useReactQuery from "./useReactQuery";

function useTransfers() {
  return useReactQuery<Transfer>({ path: "transfers", key: useTransfers.name });
}

export default useTransfers;
