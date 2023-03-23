import getPlayerNameById from './getPlayerNameById';

type GenerateMathsMessageTelegramData = {
  matchs: Match[];
  tournamentData: TournamentData;
};

const generateMathsMessageTelegram = ({
  matchs,
  tournamentData,
}: GenerateMathsMessageTelegramData): string => {
  let message = '';

  const { name, format, ratings, rounds } = tournamentData;

  message += `Evento: ${name}\n`;

  message += `Formato: ${format.toUpperCase()}\tRodada: ${
    ratings.length
  } de ${rounds}\n`;

  matchs.forEach(({ playersIds }, index) => {
    const firstPlayerName = getPlayerNameById({
      playerId: playersIds[0],
      tournamentData,
    });
    const secondPlayerName = getPlayerNameById({
      playerId: playersIds[1],
      tournamentData,
    });

    message += `${index + 1}. ${firstPlayerName} X ${secondPlayerName}\n`;
  });

  return message;
};

export default generateMathsMessageTelegram;
