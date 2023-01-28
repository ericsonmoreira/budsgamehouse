declare type TournamentFormat = "pioneer" | "selado" | "draft";

declare type TournamentState = "not-started" | "started" | "finished";

declare type TournamentData = {
  players: {
    id: string;
    name: string;
    email: string;
  }[];
  rounds: string;
  name: string;
  format: TournamentFormat;
};
