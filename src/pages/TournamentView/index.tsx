import {
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
import { DataGridRatingsRowData } from "../../components/DataGridRatings";
import { HandleConfirmMatchResultImp } from "../../components/MatchAccordion";
import Rating from "../../components/Rating";
import TournamentInfos from "../../components/TournamentInfos";
import ViewRatingsDialog from "../../components/ViewRatingsDialog";
import RatingsController from "../../controllers/RatingsController";
import TournamentController from "../../controllers/TournamentController";
import useTournaments from "../../hooks/useTournaments";

type TournamentViewParams = {
  id: string;
};

const TournamentView: React.FC = () => {
  const { id } = useParams<TournamentViewParams>();

  const [openViewRatingsDialog, setOpenViewRatingsDialog] = useState(false);

  const [tatingsTableData, setTatingsTableData] = useState<
    DataGridRatingsRowData[]
  >([]);

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

  const getPlayerNameById = useCallback(
    (id: string) => {
      if (tournamentData) {
        if (id === "bay") return "Bay";

        return (
          tournamentData.players.find((player) => player.id === id)?.name || ""
        );
      } else {
        return "";
      }
    },
    [tournamentData]
  );

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

  const handleInitRound = useCallback(() => {
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

      toast.success("Nova Rodada");
    }
  }, [tournamentData, tournament]);

  const handleRatingsGenerate = useCallback(() => {
    if (tournamentData) {
      const ratingsController = new RatingsController(tournamentData);

      const ratings = ratingsController.generateRatings();

      setTatingsTableData(
        ratings.map(({ playerId, ...rest }, index) => ({
          id: playerId,
          index,
          player: getPlayerNameById(playerId),
          ...rest,
        }))
      );

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
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{tournament.name}</Typography>
      </Box>
      <Box sx={{ margin: 1 }}>
        <TournamentInfos tournament={tournament} />
      </Box>
      <Box sx={{ margin: 1 }}>
        {isPossibleStartTournament && (
          <Button onClick={handleInitTornament}>Iniciar</Button>
        )}
        {isPossibleGenerateAnotherRound && (
          <Button onClick={handleInitRound}>
            Iniciar Round {tournamentData.ratings.length + 1}
          </Button>
        )}
        <Button onClick={handleRatingsGenerate}>Gerar Ratings</Button>
        <Button
          disabled={!isPossibleCloseTournament}
          onClick={handleCloseTournament}
        >
          Encerrar Torneio
        </Button>
      </Box>
      <Container maxWidth="md">
        {tournamentData.ratings.map((rating, ratingIndex) => (
          <Rating
            key={`round-${ratingIndex}`}
            ratingIndex={ratingIndex}
            rating={rating}
            tournament={tournament}
            tournamentData={tournamentData}
            getPlayerNameById={getPlayerNameById}
            handleConfirmMatchResult={handleConfirmMatchResult}
            isPossibleEditRound={isPossibleEditRound}
          />
        ))}
      </Container>
      <ViewRatingsDialog
        tatingsTableData={tatingsTableData}
        open={openViewRatingsDialog}
        setOpen={setOpenViewRatingsDialog}
        onClose={() => setOpenViewRatingsDialog(false)}
        title={tournament.name}
        subTitle={"Pontuação dos Jogadores"}
        format={tournament.format}
        round={tournamentData.ratings.length}
        roundTotal={tournament.rounds}
      />
    </>
  );
};

export default TournamentView;
