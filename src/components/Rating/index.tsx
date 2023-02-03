import { Box, Stack, Typography } from "@mui/material";
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
