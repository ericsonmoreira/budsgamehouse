import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { shuffle } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGridRatingsRowData } from "../../components/DataGridRatings";
import MatchAccordion, {
  HandleConfirmMatchResultImp,
} from "../../components/MatchAccordion";
import TournamentCard from "../../components/TournamentCard";
import ViewRatingsDialog from "../../components/ViewRatingsDialog";
import RatingsController from "../../controllers/RatingsController";
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

  const handleInitTornament = () => {
    if (tournament) {
      const newTournamentData = { ...tournamentData, ratings: [] };
      updateTournament({
        ...tournament,
        state: "started",
        data: JSON.stringify(newTournamentData),
      });
    }
  };

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

  const handleInitRound = () => {
    if (tournamentData && tournament) {
      const { ratings, players } = tournamentData;

      // Primero Round
      if (ratings.length === 0) {
        const playsersShuffle = shuffle(players);

        const matches: Match[] = [];

        while (playsersShuffle.length >= 1) {
          if (playsersShuffle.length === 1) {
            matches.push({
              playersIds: [playsersShuffle[0].id, "bay"],
              playersVirories: [0, 0],
            });

            playsersShuffle.shift(); // removendo o primeiro elemento do array
          } else {
            matches.push({
              playersIds: [playsersShuffle[0].id, playsersShuffle[1].id],
              playersVirories: [0, 0],
            });

            playsersShuffle.shift();
            playsersShuffle.shift();
          }
        }

        const newTournamentData = {
          ...tournamentData,
          ratings: [...tournamentData.ratings, matches],
        };

        updateTournament({
          ...tournament,
          data: JSON.stringify(newTournamentData),
        });

        console.log(JSON.stringify({ matches }, null, 2));
      } else {
        console.log("Mais de uma rodada");
      }
    }
  };

  const handleRatingsGenerate = () => {
    if (tournamentData) {
      const ratingsController = new RatingsController(tournamentData);

      const ratings = ratingsController.generateRatings();

      setTatingsTableData(
        ratings.map(({ playerId, points, mwp, gwp, omwp }, index) => ({
          id: playerId,
          index,
          player: getPlayerNameById(playerId),
          points,
          mwp,
          gwp,
          omwp,
        }))
      );

      setOpenViewRatingsDialog(true);
    }
  };

  if (isLoading || !tournament) return <CircularProgress />;

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
        <Button size="large" onClick={handleRatingsGenerate}>
          Gerar Ratings
        </Button>
      </Box>
      {tournament && tournamentData && (
        <Box sx={{ margin: 1, maxWidth: 275 }}>
          <TournamentCard
            data={{
              id: tournament.id,
              name: tournament.name,
              format: tournament.format,
              rouns: tournament.rounds,
              state: tournament.state,
              players: tournamentData.players,
            }}
          />
          <Button onClick={handleInitTornament}>Iniciar</Button>
          <Button onClick={handleInitRound}>
            Iniciar Round {tournamentData.ratings.length + 1}
          </Button>
        </Box>
      )}
      {tournamentData?.ratings.map((rating, ratingIndex) => (
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
      <Typography>{JSON.stringify(tournamentData)}</Typography>
      {tournament && tournamentData && (
        <ViewRatingsDialog
          tatingsTableData={tatingsTableData}
          open={openViewRatingsDialog}
          setOpen={setOpenViewRatingsDialog}
          onClose={() => setOpenViewRatingsDialog(false)}
          title={tournament.name}
          subTitle={"Pontuação dos Jogadores"}
          format={tournament.format}
          round={tournamentData.ratings.length}
        />
      )}
    </>
  );
};

export default TournamentView;
