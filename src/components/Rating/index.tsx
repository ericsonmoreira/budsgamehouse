import { Box, Typography, Stack } from "@mui/material";
import MatchAccordion, { HandleConfirmMatchResultImp } from "../MatchAccordion";

type RatingProps = {
  rating: Match[];
  ratingIndex: number;
  tournament: Tournament;
  tournamentData: TournamentData;
  getPlayerNameById(id: string): string;
  handleConfirmMatchResult: HandleConfirmMatchResultImp;
  isPossibleEditRound(round: number): boolean;
};

const Rating: React.FC<RatingProps> = ({
  rating,
  ratingIndex,
  tournament,
  tournamentData,
  getPlayerNameById,
  handleConfirmMatchResult,
  isPossibleEditRound,
}) => {
  return (
    <Box key={`round-${ratingIndex}`}>
      <Typography variant="h6">Rodada {ratingIndex + 1}</Typography>
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
              getPlayerNameById={getPlayerNameById}
              handleConfirmMatchResult={handleConfirmMatchResult}
              isPossibleEditMatch={isPossibleEditRound(ratingIndex)}
            />
          ))}
        </Box>
      ) : (
        <Stack spacing={0.5}>
          {rating.map((match, matchIndex) => (
            <Stack key={match.playersIds.join()}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ width: 200 }}>
                  {matchIndex + 1}. {getPlayerNameById(match.playersIds[0])}
                </Typography>
                <Typography sx={{ textAlign: "center" }}>
                  {match.playersVirories[0]} X {match.playersVirories[1]}
                </Typography>
                <Typography sx={{ width: 200, textAlign: "right" }}>
                  {getPlayerNameById(match.playersIds[1])}
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
