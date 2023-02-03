import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-hot-toast";
import sendTelegramMessage from "../../resources/sendTelegramMessage";
import generateMathsMessageTelegram from "../../utils/generateMathsMessageTelegram";
import getPlayerNameById from "../../utils/getPlayerNameById";
import MatchAccordion, { HandleConfirmMatchResultImp } from "../MatchAccordion";

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
    <Box key={`round-${ratingIndex}`} sx={{ marginY: 2 }}>
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
        <Box sx={{ marginTop: 1 }}>
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
        <Stack spacing={0.5}>
          {rating.map((match, matchIndex) => (
            <Stack key={match.playersIds.join()}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ width: 200 }}>
                  {matchIndex + 1}.{" "}
                  {getPlayerNameById({
                    playerId: match.playersIds[0],
                    tournamentData,
                  })}
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  {match.playersVirories[0]} X {match.playersVirories[1]}
                </Typography>
                <Typography sx={{ width: 200, textAlign: "right" }}>
                  {getPlayerNameById({
                    playerId: match.playersIds[1],
                    tournamentData,
                  })}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Rating;
