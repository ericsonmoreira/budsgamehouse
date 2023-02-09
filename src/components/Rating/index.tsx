import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import sendTelegramMessage from "../../resources/sendTelegramMessage";
import generateMathsMessageTelegram from "../../utils/generateMathsMessageTelegram";
import MatchAccordion, { HandleConfirmMatchResultImp } from "../MatchAccordion";
import MatchFinished from "../MatchFinished";

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
  const handleSendMatchsToTelegramChat = async () => {
    await sendTelegramMessage(
      generateMathsMessageTelegram({ matchs: rating, tournamentData })
    );

    toast.success("Mensagem enviada com sucesso!");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Rodada {ratingIndex + 1}</Typography>
        {isPossibleEditRound(ratingIndex) && (
          <Button
            variant="outlined"
            endIcon={<TelegramIcon />}
            onClick={handleSendMatchsToTelegramChat}
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
