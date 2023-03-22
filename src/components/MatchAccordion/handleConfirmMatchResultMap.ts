import { HandleConfirmMatchResultImp } from '.';

type HandleConfirmMatchResultMapProps = {
  matchIndex: number;
  ratingIndex: number;
  handleConfirmMatchResult: HandleConfirmMatchResultImp;
};

const handleConfirmMatchResultMap = ({
  ratingIndex,
  matchIndex,
  handleConfirmMatchResult,
}: HandleConfirmMatchResultMapProps): {
  [T in MatchResult]: {
    [K in MatchDrawResult | MatchVictoryResult]: () => void;
  };
} => ({
  'first-player-win': {
    'two-zero': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 2,
        seconfPlayerVictories: 0,
      }),
    'one-zero': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 1,
        seconfPlayerVictories: 0,
      }),
    'two-one': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 2,
        seconfPlayerVictories: 1,
      }),
    'one-one': () => {},
    'zero-zero': () => {},
  },
  'second-player-win': {
    'two-zero': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 0,
        seconfPlayerVictories: 2,
      }),
    'one-zero': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 0,
        seconfPlayerVictories: 1,
      }),
    'two-one': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 1,
        seconfPlayerVictories: 2,
      }),
    'one-one': () => {},
    'zero-zero': () => {},
  },
  draw: {
    'two-zero': () => {},
    'one-zero': () => {},
    'two-one': () => {},
    'one-one': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 1,
        seconfPlayerVictories: 1,
      }),
    'zero-zero': () =>
      handleConfirmMatchResult({
        ratingIndex,
        matchIndex,
        firstPlayerVictories: 0,
        seconfPlayerVictories: 0,
      }),
  },
});

export default handleConfirmMatchResultMap;
