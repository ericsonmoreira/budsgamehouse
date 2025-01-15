import AvatarPlayer from "@/components/AvatarPlayer";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import SaleInformationsTable from "@/components/SaleInformations";
import usePlayer from "@/hooks/usePlayer";
import useSale from "@/hooks/useSale";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

type ViewSaleParams = {
  id: string;
};

function ViewSale() {
  const { id } = useParams<ViewSaleParams>();

  const { data: sale, isLoading: isLoadingSale } = useSale(id);

  const { data: player, isLoading: isLoadingPlayer } = usePlayer(
    sale?.playerId,
  );

  return (
    <Page loading={isLoadingSale && isLoadingPlayer}>
      <PageHeader title="Informações da Venda" containsBackButton />
      <Box mx={1} display="flex" flexDirection="column">
        <Paper>
          {player ? (
            <Box p={1}>
              <Stack direction="row" alignItems="center">
                <AvatarPlayer playerId={player.id} />
                <Typography variant="h4">{player.name}</Typography>
              </Stack>
              <Typography>Email: {player.email}</Typography>
            </Box>
          ) : (
            <Box p={1}>
              <Typography variant="h5">Venda avulsa</Typography>
              <Typography variant="h6">
                Venda cadastrada sem selecionar Cliente
              </Typography>
            </Box>
          )}
          {sale && <SaleInformationsTable data={sale} />}
        </Paper>
      </Box>
    </Page>
  );
}

export default ViewSale;
