import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import getPlayerById from "../../utils/getPlayerById";
import getPlayerNameById from "../../utils/getPlayerNameById";
import AvatarPlayer from "../AvatarPlayer";

type MatchAccordionSummaryProps = {
  matchIndex: number;
  ratingIndex: number;
  match: Match;
  tournamentData: TournamentData;
};

const MatchAccordionSummary: React.FC<MatchAccordionSummaryProps> = ({
  matchIndex,
  match,
  ratingIndex,
  tournamentData,
}) => {
  const firstPlayerId = match.playersIds[0];

  const secondPlayerId = match.playersIds[1];

  const firstPlayerVirories =
    tournamentData.ratings[ratingIndex][matchIndex].playersVirories[0];

  const secondPlayerVirories =
    tournamentData.ratings[ratingIndex][matchIndex].playersVirories[1];

  const firstPlayer = useMemo(
    () =>
      getPlayerById({
        playerId: firstPlayerId,
        tournamentData,
      }),
    [tournamentData]
  );

  const secondPlayer = useMemo(
    () =>
      getPlayerById({
        playerId: secondPlayerId,
        tournamentData,
      }),
    [tournamentData]
  );

  const firstPlayerName = useMemo(
    () =>
      getPlayerNameById({
        playerId: firstPlayerId,
        tournamentData,
      }),
    [tournamentData]
  );

  const secondPlayerName = useMemo(
    () =>
      getPlayerNameById({
        playerId: secondPlayerId,
        tournamentData,
      }),
    [tournamentData]
  );

  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box
        sx={{
          display: "flex",
          width: 1,
          marginX: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: 1,
            marginX: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: 1 }}>
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              {matchIndex + 1}.
            </Typography>
            <AvatarPlayer
              player={firstPlayer as Player}
              sx={{ marginRight: 1, width: 32, height: 32 }}
            />
            <Typography variant="h6">{firstPlayerName}</Typography>
          </Box>
          <Box sx={{ width: 1, textAlign: "center" }}>
            <Typography variant="h6">
              {firstPlayerVirories} X {secondPlayerVirories}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="h6">{secondPlayerName}</Typography>
            <AvatarPlayer
              player={secondPlayer as Player}
              sx={{ marginLeft: 1, width: 32, height: 32 }}
            />
          </Box>
        </Box>
      </Box>
    </AccordionSummary>
  );
};

export default MatchAccordionSummary;
