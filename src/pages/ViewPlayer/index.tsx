import PaidIcon from '@mui/icons-material/Paid';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AvatarPlayer from '../../components/AvatarPlayer';
import TypographyBalance from '../../components/Typography';
import PaymentDialog from '../../components/dialogs/balances/PaymentDialog';
import usePlayer from '../../hooks/usePlayer';
import useSalesFromPlayer from '../../hooks/useSalesFromPlayer';
import routesNames from '../../routes/routesNames';
import SaleInformationCard from '../../components/SalesInformationCard';

type ViewPlayerParams = {
  id: string;
};

const ViewPlayer: React.FC = () => {
  const { id } = useParams<ViewPlayerParams>();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: player, isLoading: playerIsLoading, error: playerError } = usePlayer(id ?? '');

  const { data: sales } = useSalesFromPlayer(id ?? '');

  if (playerError) {
    return <Navigate to={routesNames.NOT_FOUND} />;
  }

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Payer
        </Typography>
      </Box>
      <Box m={1} display="flex" flexDirection="column" alignItems="center">
        {player && (
          <>
            <Card sx={{ minWidth: 257 }}>
              <CardHeader
                avatar={<AvatarPlayer player={player} />}
                titleTypographyProps={{ variant: 'h5' }}
                title={player.name}
              />
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                    <PaidIcon />
                    <Typography variant="h6">Saldo</Typography>
                  </Stack>
                  <TypographyBalance balance={player.balance} variant="h5" />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  Efetuar Pagamento Pagamento
                </Button>
              </CardActions>
            </Card>
            <PaymentDialog
              title="Pagamento"
              subTitle="Esse pagamento irá ser adicionado ao Saldo do Jogador"
              open={paymentDialogOpen}
              setOpen={setPaymentDialogOpen}
              playerToUpdate={player}
            />
          </>
        )}
      </Box>
      <Stack spacing={1}>{sales && sales.map((sale) => <SaleInformationCard key={sale.id} data={sale} />)}</Stack>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={playerIsLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewPlayer;
