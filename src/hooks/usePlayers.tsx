import useReactQuery from "./useReactQuery";

function usePlayers() {
  return useReactQuery<Player>({ path: "players", key: "usePlayers" });
}

export default usePlayers;
