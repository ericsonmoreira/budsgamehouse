import useReactQuery from "./useReactQuery";

function useSchedules() {
  return useReactQuery<Schedule>({ path: "schedules", key: useSchedules.name });
}

export default useSchedules;
