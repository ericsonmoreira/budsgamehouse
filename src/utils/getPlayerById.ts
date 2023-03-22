type GetPlayerByIdData = {
  playerId: string;
  tournamentData: TournamentData;
};

const getPlayerById = ({
  playerId,
  tournamentData,
}: GetPlayerByIdData): Player | undefined => {
  if (!tournamentData) return undefined;

  if (playerId === 'bay')
    return {
      id: 'bay',
      email: 'bay',
      name: 'Bay',
    };

  return tournamentData.players.find((player) => player.id === playerId);
};

export default getPlayerById;
