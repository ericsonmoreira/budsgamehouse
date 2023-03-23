import RatingsController from '../controllers/RatingsController';
import getPlayerNameById from './getPlayerNameById';

const formatNumberToPercentage = (n: string | number) =>
  Number(n).toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  });

const generateRatingsMessageTelegram = (
  tournamentData: TournamentData
): string => {
  let message = '';

  const ratingsController = new RatingsController(tournamentData);

  const { name, format, ratings, rounds } = tournamentData;

  message += `Evento: ${name}\n`;

  message += `Formato: ${format.toUpperCase()}\tRodada: ${
    ratings.length
  } de ${rounds}\n`;

  message += '# · Jogador · Pts · VDE · MWP · GWP · OMWP · OGWP\n';

  ratingsController
    .generateRatings()
    .map(({ playerId, points, vde, mwp, gwp, omwp, ogwp }, index) => ({
      podiun: index + 1,
      name: getPlayerNameById({ playerId, tournamentData }),
      points,
      vde: vde.join('-'),
      mwp: formatNumberToPercentage(mwp),
      gwp: formatNumberToPercentage(gwp),
      omwp: formatNumberToPercentage(omwp),
      ogwp: formatNumberToPercentage(ogwp),
    }))
    .forEach(({ podiun, name, points, vde, mwp, gwp, omwp, ogwp }) => {
      message += `${podiun} · ${name} · ${points} · ${vde} · ${mwp} · ${gwp} · ${omwp} · ${ogwp}\n`;
    });

  return message;
};

export default generateRatingsMessageTelegram;
