import AddCardIcon from '@mui/icons-material/AddCard';
import CachedIcon from '@mui/icons-material/Cached';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid } from '@mui/material';
import { useMemo } from 'react';
import HomeCard, { HomeCardProps } from '../../components/HomeCard';
import usePlayers from '../../hooks/usePlayers';
import useProducts from '../../hooks/useProducts';
import useTradingCards from '../../hooks/useTradingCards';
import useWantedCards from '../../hooks/useWantedCards';
import routesNames from '../../routes/routesNames';

const Home: React.FC = () => {
  const { players, isLoading: isLoadingPlayers } = usePlayers();

  const { cards: tradingCards, isLoading: isLoadingTradingCards } = useTradingCards();

  const { cards: wantedCards, isLoading: isLoadingWantedCards } = useWantedCards();

  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const items = useMemo<HomeCardProps[]>(
    () => [
      {
        title: 'Players',
        subheader: 'Jogadores cadastrados',
        amount: players?.length,
        icon: PersonIcon,
        to: routesNames.PLAYERS,
        isLoading: isLoadingPlayers,
      },
      {
        title: 'Troca',
        subheader: 'Cards para troca',
        amount: tradingCards?.length,
        icon: CachedIcon,
        to: routesNames.TRANDING_CARDS,
        isLoading: isLoadingTradingCards,
      },
      {
        title: 'Want',
        subheader: 'Cartas que queremos',
        amount: wantedCards?.length,
        icon: AddCardIcon,
        to: routesNames.WANTED_CARDS,
        isLoading: isLoadingWantedCards,
      },
      {
        title: 'Produtos',
        subheader: 'Produtos cadastrados',
        amount: products?.length,
        icon: LocalGroceryStoreIcon,
        to: routesNames.PRODUCTS,
        isLoading: isLoadingProducts,
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
