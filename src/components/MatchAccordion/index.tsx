import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import getPlayerById from "../../utils/getPlayerById";
import getPlayerNameById from "../../utils/getPlayerNameById";
import AvatarPlayer from "../AvatarPlayer";

export type HandleConfirmMatchResultImp = (data: {
  ratingIndex: number;
  matchIndex: number;
  firstPlayerVictories: number;
  seconfPlayerVictories: number;
}) => void;

type MatchAccordionProps = {
  ratingIndex: number;
  matchIndex: number;
  match: Match;
  tournament: Tournament;
  tournamentData: TournamentData;
  handleConfirmMatchResult: HandleConfirmMatchResultImp;
};

const MatchAccordion: React.FC<MatchAccordionProps> = ({
  ratingIndex,
  matchIndex,
  match,
  tournamentData,
  handleConfirmMatchResult,
}) => {
  const [matchResult, setMatchResult] = useState<MatchResult>("draw");

  const [matchVictoryResult, setMatchVictoryResult] =
    useState<MatchVictoryResult>("two-zero");

  const [matchDrawResult, setMatchDrawResult] =
    useState<MatchDrawResult>("one-one");

  const firstPlayerId = match.playersIds[0];

  const secondPlayerId = match.playersIds[1];

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

  const firstPlayerVirories =
    tournamentData.ratings[ratingIndex][matchIndex].playersVirories[0];

  const secondPlayerVirories =
    tournamentData.ratings[ratingIndex][matchIndex].playersVirories[1];

  const handleConfirmMatchResultMap: {
    [T in MatchResult]: {
      [K in MatchDrawResult | MatchVictoryResult]: () => void;
    };
  } = {
    "first-player-win": {
      "two-zero": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 2,
          seconfPlayerVictories: 0,
        }),
      "one-zero": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 1,
          seconfPlayerVictories: 0,
        }),
      "two-one": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 2,
          seconfPlayerVictories: 1,
        }),
      "one-one": () => {},
      "zero-zero": () => {},
    },
    "second-player-win": {
      "two-zero": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 0,
          seconfPlayerVictories: 2,
        }),
      "one-zero": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 0,
          seconfPlayerVictories: 1,
        }),
      "two-one": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 1,
          seconfPlayerVictories: 2,
        }),
      "one-one": () => {},
      "zero-zero": () => {},
    },
    draw: {
      "two-zero": () => {},
      "one-zero": () => {},
      "two-one": () => {},
      "one-one": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 1,
          seconfPlayerVictories: 1,
        }),
      "zero-zero": () =>
        handleConfirmMatchResult({
          ratingIndex,
          matchIndex,
          firstPlayerVictories: 0,
          seconfPlayerVictories: 0,
        }),
    },
  };

  return (
    <Accordion
      disabled={secondPlayerId === "bay"}
      key={firstPlayerId + secondPlayerId}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {secondPlayerId === "bay" ? (
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
            </Box>
          </Box>
        ) : (
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
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ display: "flex", flexDirection: "column" }}>
        <ButtonGroup
          fullWidth
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          <Button
            disableElevation
            onClick={() => setMatchResult("first-player-win")}
            variant={
              matchResult === "first-player-win" ? "contained" : "outlined"
            }
          >
            {firstPlayerName} WIN
          </Button>
          <Button
            disableElevation
            onClick={() => setMatchResult("draw")}
            variant={matchResult === "draw" ? "contained" : "outlined"}
          >
            Empate
          </Button>
          <Button
            disableElevation
            onClick={() => setMatchResult("second-player-win")}
            variant={
              matchResult === "second-player-win" ? "contained" : "outlined"
            }
          >
            {secondPlayerName} WIN
          </Button>
        </ButtonGroup>
        <Divider sx={{ marginY: 1 }} />
        {matchResult.includes("win") ? (
          <ButtonGroup fullWidth orientation="horizontal">
            <Button
              disableElevation
              onClick={() => setMatchVictoryResult("one-zero")}
              variant={
                matchVictoryResult === "one-zero" ? "contained" : "outlined"
              }
            >
              1 - 0
            </Button>
            <Button
              disableElevation
              onClick={() => setMatchVictoryResult("two-zero")}
              variant={
                matchVictoryResult === "two-zero" ? "contained" : "outlined"
              }
            >
              2 - 0
            </Button>
            <Button
              disableElevation
              onClick={() => setMatchVictoryResult("two-one")}
              variant={
                matchVictoryResult === "two-one" ? "contained" : "outlined"
              }
            >
              2 - 1
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup fullWidth orientation="horizontal">
            <Button
              disableElevation
              onClick={() => setMatchDrawResult("zero-zero")}
              variant={
                matchDrawResult === "zero-zero" ? "contained" : "outlined"
              }
            >
              0 - 0
            </Button>
            <Button
              disableElevation
              onClick={() => setMatchDrawResult("one-one")}
              variant={matchDrawResult === "one-one" ? "contained" : "outlined"}
            >
              1 - 1
            </Button>
          </ButtonGroup>
        )}
        <Divider sx={{ marginY: 1 }} />
        <Button
          disableElevation
          onClick={() => {
            if (matchResult === "draw") {
              handleConfirmMatchResultMap[matchResult][matchDrawResult]();
            } else {
              handleConfirmMatchResultMap[matchResult][matchVictoryResult]();
            }

            toast.success("Partida atualizada com sucesso");
          }}
        >
          Confirmar
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default MatchAccordion;
