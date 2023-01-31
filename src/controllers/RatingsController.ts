import { mean, sortBy, sum } from "lodash";

export type RatingsTableData = {
  playerId: string;
  points: number; // Pontos de Jogo
  mwp: number; // Porcentual de Match-win
  gwp: number; // Porcentual de Game-win
  omwp: number; // Porcentual de Opponent's Match-win
  ogwp: number; // Porcentual de Opponent's Game-win
  vde: number[]; // Vitorias, Derotas e Empates
};

class RatingsController {
  tournamentData: TournamentData;
  ratingsTable: RatingsTableData[];

  constructor(tournamentData: TournamentData) {
    this.tournamentData = tournamentData;
    this.ratingsTable = tournamentData.players.map(({ id }) => ({
      playerId: id,
      points: 0,
      mwp: 0,
      gwp: 0,
      omwp: 0,
      ogwp: 0,
      vde: [0, 0, 0],
    }));
  }

  public generateRatings(): RatingsTableData[] {
    // Gerando os pontos
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      points: this.getPlayerPoints(playerId),
    }));

    // Gerando as VDE
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      vde: this.getPlayerVDE(playerId),
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

    // Gerando os OGWP
    this.ratingsTable = this.ratingsTable.map(({ playerId, ...rest }) => ({
      ...rest,
      playerId,
      ogwp: this.getPlayerOgwp(playerId),
    }));

    // Ordenando
    this.ratingsTable = sortBy(this.ratingsTable, [
      "points",
      "mwp",
      "gwp",
      "omwp",
      "ogwp",
    ]).reverse();

    return this.ratingsTable;
  }

  // Retorna as Vitórias, Derotas e Empates
  private getPlayerVDE(playerId: string): number[] {
    let V = 0;
    let D = 0;
    let E = 0;

    this.tournamentData.ratings.forEach((matches) => {
      const match = matches.find((match) =>
        match.playersIds.includes(playerId)
      ) as Match;

      const playerIndex = match.playersIds.indexOf(playerId);

      const anotherPlayerIndex = playerIndex === 0 ? 1 : 0;

      if (match.playersIds.includes("bay")) {
        V++;
      } else {
        if (
          match.playersVirories[playerIndex] >
          match.playersVirories[anotherPlayerIndex]
        ) {
          V++;
        } else if (
          match.playersVirories[playerIndex] <
          match.playersVirories[anotherPlayerIndex]
        ) {
          D++;
        } else {
          E++;
        }
      }
    });

    return [V, D, E];
  }

  // Retorna os pontos de um Jogador
  private getPlayerPoints(playerId: string): number {
    var playerVDE = this.getPlayerVDE(playerId);

    // Esse multiplicação por 0 é desnecessária mas serve para ilustrar como é feiro o cálculo dos pontos.
    return playerVDE[0] * 3 + playerVDE[1] * 0 + playerVDE[2] * 1;
  }

  // O porcentual de match-win de um jogador são o total de pontos de vitória acumulados divididos pelo total de
  // pontos de vitória possíveis naquelas rodadas (geralmente 3 vezes o número de rodadas jogadas). Se esse número
  // for menor que 0,33, utilizemos 0,33. O porcentual de match-win mínimo de 0,33 limita o efeito que performances
  // baixas têm ao se calcular e comparar porcentual de match-win de oponentes.
  private getPlayerMwp(playerId: string): number {
    // quantidade de rodadas que o jogador jogou
    const playerRoundsPlayed = this.tournamentData.ratings.reduce(
      (acc, matches) =>
        matches.some((matche) => matche.playersIds.includes(playerId))
          ? acc + 1
          : acc,
      0
    );

    const { points } = this.ratingsTable.find(
      (row) => row.playerId === playerId
    ) as RatingsTableData;

    const mwp = points / (playerRoundsPlayed * 3);

    // Se mwp for menor que 33%, retornar 33%
    return mwp > 0.33 ? mwp : 0.33;
  }

  // Parecido com porcentual de match-win, o porcentual game-win de um jogador é o total de pontos de jogo ele
  // recebeu divididos pelo total de pontos de jogo possíveis (geralmente 3 vezes o número de jogos jogados).
  // Novamente, se utiliza 0,33 se o porcentual game-win real for menor do que isso.
  private getPlayerGwp(playerId: string): number {
    // quantidade de rodadas que o jogador jogou
    const playerGamesPlayed = this.tournamentData.ratings.reduce(
      (acc, matches) => {
        const playerMatch = matches.find((match) =>
          match.playersIds.includes(playerId)
        ) as Match;

        return acc + sum(playerMatch.playersVirories);
      },
      0
    );

    const { points } = this.ratingsTable.find(
      (row) => row.playerId === playerId
    ) as RatingsTableData;

    const gwp = points / (playerGamesPlayed * 3);

    return gwp > 0.33 ? gwp : 0.33;
  }

  // O porcentual de opponents’ match-win de um jogador é a média dos porcentuais de match-win de cada oponente
  // enfrentado por aquele jogador (ignorando aquelas rodadas que o jogador recebeu um bye). Use a definição do
  // porcentual de match-win mencionada acima para calcular individualmente cada porcentual opponent’s match-win.
  // Os byes de um jogador são ignorados quando se calcula seus porcentuais opponents’ match-win e opponents’ game-win.
  private getPlayerOmwp(playerId: string): number {
    const playerValidMatches = this.getPlayerValidMatches(playerId);

    const omws = playerValidMatches.map((match) => {
      const playerMatchIndex = match.playersIds.indexOf(playerId);

      return this.getPlayerMwp(
        match.playersIds[playerMatchIndex === 0 ? 1 : 0]
      );
    });

    return omws.length > 0 ? mean(omws) : 0;
  }

  // Parecido com o porcentual opponents’ match-win, o porcentual opponents’ game-win de um jogador é
  // simplesmente a média de porcentual game-win de todos os oponentes daquele jogador. E assim como no
  // porcentual de opponents’ match-win, cada oponente tem um mínimo de porcentual de game-win de 0,33.
  // Os byes de um jogador são ignorados quando se calcula seus porcentuais opponents’ match-win e opponents’ game-win.
  private getPlayerOgwp(playerId: string): number {
    const playerValidMatches = this.getPlayerValidMatches(playerId);

    const gwps = playerValidMatches.map((match) => {
      const playerMatchIndex = match.playersIds.indexOf(playerId);

      return this.getPlayerGwp(
        match.playersIds[playerMatchIndex === 0 ? 1 : 0]
      );
    });

    return gwps.length > 0 ? mean(gwps) : 0;
  }

  // Retorna as partidas de um jogador em que seu oponente não foi o Bay.
  private getPlayerValidMatches(playerId: string): Match[] {
    const playerMatches = this.tournamentData.ratings.map((rating) => {
      const playerMatch = rating.find((match) =>
        match.playersIds.includes(playerId)
      ) as Match;

      return playerMatch;
    });

    // Somente é válidas as partidas que não sejam com o bay
    const playerValidMatches = playerMatches.filter(
      (match) => !match.playersIds.includes("bay")
    );

    return playerValidMatches;
  }
}

export default RatingsController;
