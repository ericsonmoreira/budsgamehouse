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
import tablemark from "tablemark";
import { DataGridRatingsRowData } from "../../components/DataGridRatings";
import { HandleConfirmMatchResultImp } from "../../components/MatchAccordion";
import Rating from "../../components/Rating";
import TournamentInfos from "../../components/TournamentInfos";
import ViewRatingsDialog from "../../components/ViewRatingsDialog";
import RatingsController from "../../controllers/RatingsController";
import TournamentController from "../../controllers/TournamentController";
import useTournaments from "../../hooks/useTournaments";
import sendTelegramMessage from "../../resources/sendTelegramMessage";
import getPlayerNameById from "../../utils/getPlayerNameById";

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

      toast.success("Nova Rodada");

      await sendTelegramMessage(JSON.stringify(matches, null, 2));
    }
  }, [tournamentData, tournament]);

  const handleRatingsGenerate = useCallback(async () => {
    if (tournamentData) {
      const ratingsController = new RatingsController(tournamentData);

      const ratings = ratingsController.generateRatings();

      setTatingsTableData(
        ratings.map(({ playerId, ...rest }, index) => ({
          id: playerId,
          index,
          player: getPlayerNameById({ tournamentData, playerId }),
          ...rest,
        }))
      );

      const tableRender = tablemark(
        ratings.map(
          ({ playerId, points, vde, mwp, gwp, omwp, ogwp }, index) => ({
            podiun: index + 1,
            name: getPlayerNameById({ playerId, tournamentData }),
            points,
            vde: vde.join("-"),
            mwp: Number(mwp).toLocaleString("pt-Br", {
              style: "percent",
              minimumFractionDigits: 2,
            }),
            gwp: Number(gwp).toLocaleString("pt-Br", {
              style: "percent",
              minimumFractionDigits: 2,
            }),
            omwp: Number(omwp).toLocaleString("pt-Br", {
              style: "percent",
              minimumFractionDigits: 2,
            }),
            ogwp: Number(ogwp).toLocaleString("pt-Br", {
              style: "percent",
              minimumFractionDigits: 2,
            }),
          })
        )
      );

      console.log(tableRender);

      await sendTelegramMessage(tableRender, "Markdown");
    }
  }, [tournamentData]);

  const handleCloseTournament = useCallback(async () => {
    if (tournament) {
      const newTournament: Tournament = { ...tournament, state: "finished" };

      updateTournament({ ...tournament, state: "finished" });

      toast.success("Torneiro Encerrado!");

      await sendTelegramMessage(JSON.stringify(newTournament, null, 2));
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
