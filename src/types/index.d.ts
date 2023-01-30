declare type Player = {
  id: string;
  name: string;
  email: string;
};

declare type TournamentFormat = "pioneer" | "selado" | "draft";

declare type TournamentState = "not-started" | "started" | "finished";

declare type Tournament = {
  id: string;
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  data: string;
};

declare type TournamentData = {
  players: {
    id: string;
    name: string;
    email: string;
  }[];
  rounds: string;
  name: string;
  format: TournamentFormat;
  ratings: Match[][];
};

declare type Match = {
  playersIds: strings[];
  playersVirories: number[];
};

declare type MatchResult = "first-player-win" | "second-player-win" | "draw";

declare type MatchVictoryResult = "one-zero" | "two-zero" | "two-one";

declare type MatchDrawResult = "one-one" | "zero-zero";
