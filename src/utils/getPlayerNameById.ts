type GetPlayerNameByIdData = {
  playerId: string;
  tournamentData: TournamentData;
};

const getPlayerNameById = ({
  playerId,
  tournamentData,
}: GetPlayerNameByIdData): string => {
  if (!tournamentData) return "";

  if (playerId === "bay") return "Bay";

  return (
    tournamentData.players.find((player) => player.id === playerId)?.name || ""
  );
};

export default getPlayerNameById;
