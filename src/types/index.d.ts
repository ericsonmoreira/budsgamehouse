declare type TournamentFormat = "pioneer" | "selado" | "draft";

declare type TournamentState = "not-started" | "started" | "finished";

declare type NegotiationStatus = "created" | "sent" | "received";

declare type Associate = {
  id: string;
  name: string;
  phone: string;
};

declare type Negotiation = {
  id: string;
  description: string;
  status: NegotiationStatus;
  price: number;
  associateId: string;
};

declare type Player = {
  id: string;
  name: string;
  email: string;
  avatarImgUrl?: string;
};

declare type Tournament = {
  id: string;
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  data: string;
};

declare type TournamentData = {
  players: Player[];
  rounds: number;
  name: string;
  format: TournamentFormat;
  ratings: Match[][];
};

declare type Match = {
  playersIds: strings[];
  playersVirories: number[];
};

declare type WantedCard = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
  priority: WantedCardPriority;
};

declare type WantedCardPriority = "high" | "medium" | "low";

declare type MatchResult = "first-player-win" | "second-player-win" | "draw";

declare type MatchVictoryResult = "one-zero" | "two-zero" | "two-one";

declare type MatchDrawResult = "one-one" | "zero-zero";
