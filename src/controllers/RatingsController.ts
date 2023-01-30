import { sortBy } from "lodash";

export type TatingsTableData = {
  playerId: string;
  points: number; // Pontos de Jogo
  mwp: number; // Porcentual de Match-win
  gwp: number; // Porcentual de Game-win
  omwp: number; // Porcentual de Opponent's Match-win
};

class RatingsController {
  tournamentData: TournamentData;
  ratingsTable: TatingsTableData[];

  constructor(tournamentData: TournamentData) {
    this.tournamentData = tournamentData;
    this.ratingsTable = tournamentData.players.map(({ id }) => ({
      playerId: id,
      points: 0,
      mwp: 0,
      gwp: 0,
      omwp: 0,
    }));
  }

  public generateRatings(): TatingsTableData[] {
    // Gerando os pontos
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      points: this.getPlayerPoints(playerId),
    }));

    // Gerando os MWP
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      mwp: this.getPlayerMwp(playerId),
    }));

    // Gerando os GWP
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      gwp: this.getPlayerGwp(playerId),
    }));

    // Gerando os OMWP
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      omwp: this.getPlayerOmwp(playerId),
    }));

    // Ordenando
    this.ratingsTable = sortBy(this.ratingsTable, [
      "points",
      "mwp",
      "gwp",
      "omwp",
    ]).reverse();

    return this.ratingsTable;
  }

  private getPlayerPoints(playerId: string): number {
    return this.tournamentData.ratings.reduce((acc, matches) => {
      const match = matches.find((match) =>
        match.playersIds.includes(playerId)
      ) as Match;

      const isBay = match.playersIds.includes("bay");

      if (isBay) return acc + 3; // Se for bay, 3 pontos

      const isDraw = match.playersVirories[0] === match.playersVirories[1];

      if (isDraw) return acc + 1; // Se for empate, 1 ponto

      const indexOfPlayer = match.playersIds.indexOf(playerId);

      if (indexOfPlayer === 0) {
        return acc + match.playersVirories[0] > match.playersVirories[1]
          ? 3
          : 0;
      } else {
        return acc + match.playersVirories[1] > match.playersVirories[0]
          ? 3
          : 0;
      }
    }, 0);
  }

  private getPlayerMwp(playerId: string): number {
    return 0;
  }

  private getPlayerGwp(playerId: string): number {
    return 0;
  }

  private getPlayerOmwp(playerId: string): number {
    return 0;
  }
}

export default RatingsController;
