import AddCardIcon from '@mui/icons-material/AddCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CachedIcon from '@mui/icons-material/Cached';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid } from '@mui/material';
import { useMemo } from 'react';
import HomeCard, { HomeCardProps } from '../../components/HomeCard';
import useAssociates from '../../hooks/useAssociates';
import useNegotiations from '../../hooks/useNegotiations';
import usePlayers from '../../hooks/usePlayers';
import useTournaments from '../../hooks/useTournaments';
import useTradingCards from '../../hooks/useTradingCards';
import useWantedCards from '../../hooks/useWantedCards';
import routesNames from '../../routes/routesNames';

const Home: React.FC = () => {
  const { players, isLoading: isLoadingPlayers } = usePlayers();

  const { cards: tradingCards, isLoading: isLoadingTradingCards } =
    useTradingCards();

  const { cards: wantedCards, isLoading: isLoadingWantedCards } =
    useWantedCards();

  const { tournaments, isLoading: isLoadingTournaments } = useTournaments();

  const { associates, isLoading: isLoadingAssociates } = useAssociates();

  const { negotiations, isLoading: isLoadingNegotiations } = useNegotiations();

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
        title: 'Torneios',
        subheader: 'Campeonatos realizados',
        amount: tournaments?.length,
        icon: EmojiEventsIcon,
        to: routesNames.TOURNAMENTS,
        isLoading: isLoadingTournaments,
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
        title: 'Associados',
        subheader: 'Colegas de trocas de cartas',
        amount: associates?.length,
        icon: HandshakeIcon,
        to: routesNames.ASSOCIATES,
        isLoading: isLoadingAssociates,
      },
      {
        title: 'Negociações',
        subheader: 'Vendas e compras de cartas',
        amount: negotiations?.length,
        icon: AttachMoneyIcon,
        to: routesNames.NEGOTIATIONS,
        isLoading: isLoadingNegotiations,
      },
    ],
    [players, wantedCards, tradingCards, tournaments, associates, negotiations]
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
