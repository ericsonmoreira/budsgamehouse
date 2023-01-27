import { Box, Grid } from "@mui/material";
import HomeCard, { HomeCardProps } from "../../components/HomeCard";
import usePlayers from "../../hooks/usePlayers";
import AddCardIcon from "@mui/icons-material/AddCard";
import CachedIcon from "@mui/icons-material/Cached";
import PersonIcon from "@mui/icons-material/Person";
import routesNames from "../../routes/routesNames";
import useWantedCards from "../../hooks/useWantedCards";
import useTradingCards from "../../hooks/useTradingCards";
import { useMemo } from "react";

const Home: React.FC = () => {
  const { players } = usePlayers();
  const { cards: tradingCards } = useTradingCards();
  const { cards: wantedCards } = useWantedCards();

  const items = useMemo<HomeCardProps[]>(
    () => [
      {
        title: "Players",
        subheader: "Jogadores cadastrados",
        amount: players?.length,
        icon: PersonIcon,
        to: routesNames.PLAYERS,
      },
      {
        title: "Troca",
        subheader: "Cards para troca",
        amount: tradingCards?.length,
        icon: AddCardIcon,
        to: routesNames.TRANDING_CARDS,
      },
      {
        title: "Want",
        subheader: "Cartas que queremos",
        amount: wantedCards?.length,
        icon: CachedIcon,
        to: routesNames.WANTED_CARDS,
      },
    ],
    [players, wantedCards, tradingCards]
  );

  return (
    <Box sx={{ margin: 1 }}>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid key={item.title} item xs={12} md={6} lg={4} xl={3}>
            <HomeCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
