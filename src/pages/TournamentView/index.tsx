import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  AvatarGroup,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import AvatarPlayer from "../../components/AvatarPlayer";
import ViewRatingsDialog from "../../components/dialogs/ViewRatingsDialog";
import { HandleConfirmMatchResultImp } from "../../components/MatchAccordion";
import Rating from "../../components/Rating";
import Timer from "../../components/Timer";
import TournamentInfos from "../../components/TournamentInfos";
import TournamentController from "../../controllers/TournamentController";
import useTournaments from "../../hooks/useTournaments";

type TournamentViewParams = {
  id: string;
};

const TournamentView: React.FC = () => {
  const { id } = useParams<TournamentViewParams>();

  const [openViewRatingsDialog, setOpenViewRatingsDialog] = useState(false);

  const { findTournament, updateTournament } = useTournaments();

  const { data: tournament, isLoading } = findTournament(id);

  const tournamentData = useMemo<TournamentData | null>(() => {
    if (tournament?.data) {
      return JSON.parse(tournament.data);
    } else {
      return null;
    }
  }, [tournament]);

  const isPossibleStartTournament = useMemo(() => {
    if (tournament) {
      return tournament.state === "not-started";
    }

    return false;
  }, [tournament]);

  const isPossibleCloseTournament = useMemo(() => {
    const possibleStates: TournamentState[] = ["not-started", "started"];

    if (tournament) {
      return possibleStates.includes(tournament.state);
    }

    return false;
  }, [tournament]);

  const isPossibleEditRound = useCallback(
    (round: number) => {
      if (tournament && tournamentData) {
        return (
          tournament.state === "started" &&
          round >= tournamentData.ratings.length - 1
        );
      }

      return false;
    },
    [tournament, tournamentData]
  );

  const isPossibleGenerateAnotherRound = useMemo(() => {
    if (tournament && tournamentData) {
      return tournamentData.ratings.length < tournament.rounds;
    }

    return false;
  }, [tournament, tournamentData]);

  const handleInitTornament = useCallback(() => {
    if (tournament && tournamentData) {
      const newTournamentData = { ...tournamentData, ratings: [] };

      updateTournament({
        ...tournament,
        state: "started",
        data: JSON.stringify(newTournamentData),
      });
    }
  }, [tournament, tournamentData]);

  const handleConfirmMatchResult: HandleConfirmMatchResultImp = ({
    ratingIndex,
    matchIndex,
    firstPlayerVictories,
    seconfPlayerVictories,
  }) => {
    if (tournament && tournamentData) {
      const newRatings = tournamentData.ratings;

      newRatings[ratingIndex][matchIndex].playersVirories[0] =
        firstPlayerVictories;

      newRatings[ratingIndex][matchIndex].playersVirories[1] =
        seconfPlayerVictories;

      const newTournamentData = { ...tournamentData, ratings: newRatings };

      updateTournament({
        ...tournament,
        data: JSON.stringify(newTournamentData),
      });
    }
  };

  const handleInitRound = useCallback(async () => {
    if (tournamentData && tournament) {
      const tournamentController = new TournamentController(tournamentData);

      const matches: Match[] = tournamentController.getMatchesOfNewRound();

      const newTournamentData = {
        ...tournamentData,
        ratings: [...tournamentData.ratings, matches],
      };

      updateTournament({
        ...tournament,
        data: JSON.stringify(newTournamentData),
      });

      toast.success("Nova rodada iniciada!");
    }
  }, [tournamentData, tournament]);

  const handleRatingsGenerate = useCallback(async () => {
    if (tournamentData) {
      setOpenViewRatingsDialog(true);
    }
  }, [tournamentData]);

  const handleCloseTournament = useCallback(() => {
    if (tournament) {
      updateTournament({ ...tournament, state: "finished" });

      toast.success("Torneiro Encerrado!");
    }
  }, [tournament]);

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress />
      </Backdrop>
    );

  if (!(tournament && tournamentData)) return null;

  return (
    <Box>
      <Box
        sx={{
          padding: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{tournament.name}</Typography>
        <Box sx={{ marginLeft: 3 }}>
          <Timer interval={50} />
        </Box>
        <Box sx={{ marginLeft: 3 }}>
          <AvatarGroup max={10}>
            {tournamentData.players.map((player) => (
              <AvatarPlayer key={player.id} player={player} />
            ))}
          </AvatarGroup>
        </Box>
      </Box>
      <Box sx={{ margin: 1 }}>
        <TournamentInfos tournament={tournament} />
      </Box>
      <Box
        sx={{
          margin: 1,
          display: "flex",
        }}
      >
        {isPossibleStartTournament && (
          <Button
            onClick={handleInitTornament}
            disableElevation
            variant="contained"
            endIcon={<PlayArrowIcon />}
            sx={{ marginRight: 1 }}
          >
            Iniciar
          </Button>
        )}
        {isPossibleGenerateAnotherRound && (
          <Button
            onClick={handleInitRound}
            disableElevation
            variant="contained"
            endIcon={<ArticleIcon />}
            sx={{ marginRight: 1 }}
          >
            Iniciar Round {tournamentData.ratings.length + 1}
          </Button>
        )}
        <Button
          onClick={handleRatingsGenerate}
          disableElevation
          variant="contained"
          endIcon={<GroupIcon />}
          sx={{ marginRight: 1 }}
        >
          Gerar Ratings
        </Button>
        <Button
          disabled={!isPossibleCloseTournament}
          disableElevation
          variant="contained"
          color="error"
          onClick={handleCloseTournament}
          endIcon={<CloseIcon />}
          sx={{ marginRight: 1 }}
        >
          Encerrar Torneio
        </Button>
      </Box>
      <Container maxWidth="md">
        {tournamentData.ratings
          .map((rating, ratingIndex) => (
            <Rating
              key={`round-${ratingIndex}`}
              ratingIndex={ratingIndex}
              rating={rating}
              tournament={tournament}
              tournamentData={tournamentData}
              handleConfirmMatchResult={handleConfirmMatchResult}
              isPossibleEditRound={isPossibleEditRound}
            />
          ))
          .reverse()}
      </Container>
      <ViewRatingsDialog
        tournamentData={tournamentData}
        open={openViewRatingsDialog}
        setOpen={setOpenViewRatingsDialog}
        onClose={() => setOpenViewRatingsDialog(false)}
        title={tournament.name}
        subTitle={"Pontuação dos Jogadores"}
        format={tournament.format}
        round={tournamentData.ratings.length}
        roundTotal={tournament.rounds}
      />
    </Box>
  );
};

export default TournamentView;
