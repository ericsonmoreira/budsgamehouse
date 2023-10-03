import PaidIcon from '@mui/icons-material/Paid';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import AvatarPlayer from '../../components/AvatarPlayer';
import SaleInformationsTable from '../../components/SaleInformationsTable';
import TypographyBalance from '../../components/Typography';
import PaymentDialog from '../../components/dialogs/balances/PaymentDialog';
import usePlayer from '../../hooks/usePlayer';
import useSalesFromPlayer from '../../hooks/useSalesFromPlayer';
import routesNames from '../../routes/routesNames';

type ViewPlayerParams = {
  id: string;
};

const ViewPlayer: React.FC = () => {
  const { id } = useParams<ViewPlayerParams>();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: player, isLoading: playerIsLoading, error: playerError } = usePlayer(id ?? '');

  const { data: sales } = useSalesFromPlayer(id ?? '');

  const { palette, spacing } = useTheme();

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
      <Box m={1} display="flex" flexDirection="column">
        {player && (
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
              <Typography color="GrayText">Email: {player.email}</Typography>
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
            <PaymentDialog
              title="Pagamento"
              subTitle="Esse pagamento irá ser adicionado ao Saldo do Jogador"
              open={paymentDialogOpen}
              setOpen={setPaymentDialogOpen}
              playerToUpdate={player}
            />
          </Card>
        )}
        {sales &&
          sales.map((sale) => (
            <VerticalTimeline key={sale.id} lineColor={palette.text.secondary}>
              <VerticalTimelineElement
                position="right"
                date={format(sale.createdAt.toDate(), 'PPPp', { locale: ptBR })}
                iconStyle={{
                  background: palette.primary.main,
                  color: palette.common.white,
                  borderBlockColor: palette.text.secondary,
                }}
                contentArrowStyle={{ borderRightColor: palette.primary.main }}
                contentStyle={{
                  backgroundColor: palette.primary.main,
                  boxShadow: 'none',
                  color: palette.text.primary,
                  padding: spacing(1),
                }}
                icon={<ShoppingCartIcon />}
              >
                <SaleInformationsTable key={sale.id} data={sale} />
              </VerticalTimelineElement>
            </VerticalTimeline>
          ))}
      </Box>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={playerIsLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewPlayer;
