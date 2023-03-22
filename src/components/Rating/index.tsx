import TelegramIcon from '@mui/icons-material/Telegram';
import { Box, Button, Stack, Typography } from '@mui/material';
import { toBlob } from 'html-to-image';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import sendPhotoTelegram from '../../resources/sendPhotoTelegram';
import MatchAccordion, { HandleConfirmMatchResultImp } from '../MatchAccordion';
import MatchFinished from '../MatchFinished';

type RatingProps = {
  rating: Match[];
  ratingIndex: number;
  tournament: Tournament;
  tournamentData: TournamentData;
  handleConfirmMatchResult: HandleConfirmMatchResultImp;
  isPossibleEditRound(round: number): boolean;
};

const Rating: React.FC<RatingProps> = ({
  rating,
  ratingIndex,
  tournament,
  tournamentData,
  handleConfirmMatchResult,
  isPossibleEditRound,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendPhotoTelegram = useCallback(async () => {
    if (ref.current) {
      try {
        setIsLoading(true);

        const blob = await toBlob(ref.current, { cacheBust: true });

        await sendPhotoTelegram(blob as Blob);

        toast.success('Mensagem enviada com sucesso!');
      } catch (error) {
        toast.error('Algo inesperado aconteceu!');
      } finally {
        setIsLoading(false);
      }
    }
  }, [ref.current]);

  return (
    <Box ref={ref}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" color="textPrimary">
          Rodada {ratingIndex + 1}
        </Typography>
        {isPossibleEditRound(ratingIndex) && (
          <Button
            disabled={isLoading}
            variant="outlined"
            endIcon={<TelegramIcon />}
            onClick={handleSendPhotoTelegram}
          >
            Enviar
          </Button>
        )}
      </Box>
      {isPossibleEditRound(ratingIndex) ? (
        <Box sx={{ marginY: 1 }}>
          {rating.map((match, matchIndex) => (
            <MatchAccordion
              key={`match-${match.playersIds[0]}-${match.playersIds[1]}`}
              ratingIndex={ratingIndex}
              matchIndex={matchIndex}
              match={match}
              tournament={tournament}
              tournamentData={tournamentData}
              handleConfirmMatchResult={handleConfirmMatchResult}
            />
          ))}
        </Box>
      ) : (
        <Stack spacing={1} sx={{ marginY: 1 }}>
          {rating.map((match, matchIndex) => (
            <MatchFinished
              match={match}
              matchIndex={matchIndex}
              tournamentData={tournamentData}
              key={match.playersIds.join()}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Rating;
