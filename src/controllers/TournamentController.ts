import { groupBy, shuffle } from 'lodash';
import RatingsController, { RatingsTableData } from './RatingsController';

type PlayerWithPoints = Player & {
  points: number;
};

class TournamentController {
  tournamentData: TournamentData;

  constructor(tournamentData: TournamentData) {
    this.tournamentData = tournamentData;
  }

  public getMatchesOfNewRound(): Match[] {
    const matches: Match[] = [];

    const players = this.getShufflePlayersGroupByPoints();

    while (players.length >= 1) {
      if (players.length === 1) {
        matches.push({
          playersIds: [players[0].id, 'bay'],
          // Quando um jogador recebe um bye em uma rodada, ele é considerado como tendo vencido a partida 2-0.
          playersVirories: [2, 0],
        });

        players.shift(); // removendo o primeiro elemento do array
      } else {
        let indexSecondPlayerValid = 1;

        while (
          this.playersHaveFacedEachOther(
            players[0].id,
            players[indexSecondPlayerValid].id
          )
        ) {
          indexSecondPlayerValid = indexSecondPlayerValid + 1;
        }

        matches.push({
          playersIds: [players[0].id, players[indexSecondPlayerValid].id],
          playersVirories: [0, 0],
        });

        players.shift(); // remover o primeiro elemento da lista
        players.splice(indexSecondPlayerValid - 1, 1); // remove o elemento na possição indexSecondPlayerValid
      }
    }
    return matches;
  }

  // Retorna a lista de jogadores embaralhados por grupos de pontos em ordem decrescente.
  private getShufflePlayersGroupByPoints(): Player[] {
    const players: Player[] = [];

    const playersWithPoints = this.getPlayersWithPoints();

    const playersWithPointsGroupByPoints = groupBy(
      playersWithPoints,
      ({ points }) => points
    );

    Object.values(playersWithPointsGroupByPoints)
      .reverse() // inverter para pegar primeiro os de maior pontuação
      .forEach((groupPlayers) => {
        const groupPlayersShuffle = shuffle(groupPlayers);

        groupPlayersShuffle.forEach(({ id, name, email }) => {
          players.push({ id, name, email });
        });
      });

    return players;
  }

  private getPlayersWithPoints(): PlayerWithPoints[] {
    const ratingsController = new RatingsController(this.tournamentData);

    const atualRatings = ratingsController.generateRatings();

    const playersWithPoints = this.tournamentData.players.map((player) => {
      const { points } = atualRatings.find(
        (rating) => rating.playerId === player.id
      ) as RatingsTableData;

      return { ...player, points } as PlayerWithPoints;
    });

    return playersWithPoints;
  }

  // verifica se dois jodadores já se enfrentaram antes
  public playersHaveFacedEachOther(
    firtPlayerId: string,
    secondPlayerId: string
  ): boolean {
    for (let x = this.tournamentData.ratings.length - 1; x >= 0; x--) {
      for (let y = 0; y < this.tournamentData.ratings[x].length; y++) {
        if (
          this.tournamentData.ratings[x][y].playersIds.includes(firtPlayerId) &&
          this.tournamentData.ratings[x][y].playersIds.includes(secondPlayerId)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

export default TournamentController;

