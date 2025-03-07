import Page from "@/components/Page";
import usePlayers from "@/hooks/usePlayers";
import useProducts from "@/hooks/useProducts";
import useWantedCards from "@/hooks/useWantedCards";
import routesNames from "@/routes/routesNames";
import AddCardIcon from "@mui/icons-material/AddCard";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PersonIcon from "@mui/icons-material/Person";
import { Grid2 as Grid } from "@mui/material";
import HomeCard, { HomeCardProps } from "./HomeCard";
import MarketCard from "./MarketCard";

function Home() {
  const { data: players, isLoading: isLoadingPlayers } = usePlayers();

  const { cards: wantedCards, isLoading: isLoadingWantedCards } =
    useWantedCards();

  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const items: HomeCardProps[] = [
    {
      title: "Players",
      subheader: "Jogadores Cadastrados",
      amount: players?.length,
      icon: PersonIcon,
      to: routesNames.PLAYERS,
      isLoading: isLoadingPlayers,
    },
    {
      title: "Produtos",
      subheader: "Produtos Cadastrados",
      amount: products?.length,
      icon: LocalGroceryStoreIcon,
      to: routesNames.PRODUCTS,
      isLoading: isLoadingProducts,
    },
    {
      title: "Want",
      subheader: "Cartas que queremos",
      amount: wantedCards?.length,
      icon: AddCardIcon,
      to: routesNames.WANTED_CARDS,
      isLoading: isLoadingWantedCards,
    },
  ];

  return (
    <Page loading={isLoadingPlayers || isLoadingProducts}>
      <Grid container spacing={1} p={1}>
        <Grid size={12}>
          <MarketCard />
        </Grid>
        {items.map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <HomeCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}

export default Home;
