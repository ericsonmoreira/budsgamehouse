import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { groupBy, shuffle } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { DataGridRatingsRowData } from "../../components/DataGridRatings";
import MatchAccordion, {
  HandleConfirmMatchResultImp,
} from "../../components/MatchAccordion";
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
    if (tournament) {
      return tournament.state === "started";
    }

    return false;
  }, [tournament]);

  const isPossibleEditRound = useCallback(
    (round: number) => {
      if (tournament) {
        return tournament.state === "started";
      }

      return false;
    },
    [tournament]
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
        <Typography variant="h4">Torneio</Typography>
      </Box>
      <Box sx={{ margin: 1 }}>
        <TournamentInfos tournament={tournament} />
      </Box>
      <Box sx={{ margin: 1 }}>
        <Button
          disabled={!isPossibleStartTournament}
          onClick={handleInitTornament}
        >
          Iniciar
        </Button>
        <Button
          disabled={!isPossibleGenerateAnotherRound}
          onClick={handleInitRound}
        >
          Iniciar Round {tournamentData.ratings.length + 1}
        </Button>
        <Button onClick={handleRatingsGenerate}>Gerar Ratings</Button>
        <Button
          disabled={!isPossibleCloseTournament}
          onClick={handleCloseTournament}
        >
          Encerrar Torneio
        </Button>
      </Box>
      {tournamentData.ratings.map((rating, ratingIndex) => (
        <Box key={`round-${ratingIndex}`} sx={{ width: 500, margin: 1 }}>
          <Typography variant="h6">Rodada {ratingIndex + 1}</Typography>
          <Box sx={{ marginTop: 1 }}>
            {rating.map((match, matchIndex) => (
              <MatchAccordion
                ratingIndex={ratingIndex}
                matchIndex={matchIndex}
                tournament={tournament}
                tournamentData={tournamentData}
                key={`match-${match.playersIds[0]}-${match.playersIds[1]}`}
                getPlayerNameById={getPlayerNameById}
                match={match}
                handleConfirmMatchResult={handleConfirmMatchResult}
              />
            ))}
          </Box>
        </Box>
      ))}
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
