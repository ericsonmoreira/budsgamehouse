import EmailIcon from '@mui/icons-material/Email';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentIcon from '@mui/icons-material/Payment';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import 'react-vertical-timeline-component/style.min.css';
import AvatarPlayer from '../../components/AvatarPlayer';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import PlayerExtract from '../../components/PlayerExtract';
import TypographyBalance from '../../components/TypographyBalance';
import PaymentDialog from '../../components/dialogs/balances/PaymentDialog';
import usePlayer from '../../hooks/usePlayer';
import routesNames from '../../routes/routesNames';
import { PhoneIcon } from '../../icons';

type ViewPlayerParams = {
  id: string;
};

const ViewPlayer: React.FC = () => {
  const { id } = useParams<ViewPlayerParams>();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: player, isLoading: playerIsLoading, error: playerError } = usePlayer(id);

  if (playerError) {
    return <Navigate to={routesNames.NOT_FOUND} />;
  }

  return (
    <Page loading={playerIsLoading}>
      <PageHeader title="Payer" containsBackButton />
      <Box m={1} display="flex" flexDirection="column">
        {player && (
          <>
            <Card sx={{ minWidth: 257 }}>
              <CardHeader
                avatar={<AvatarPlayer playerId={player.id} />}
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon fontSize="small" />
                  <Typography color="GrayText">{player.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon fontSize="small" />
                  <Typography color="GrayText">{player.phone}</Typography>
                </Stack>
              </CardContent>
              <CardActions
                sx={({ palette }) => ({
                  borderTop: 1,
                  borderTopColor: palette.divider,
                })}
              >
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
            <Box marginTop={1}>
              <PlayerExtract player={player} />
            </Box>
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
    </Page>
  );
};

export default ViewPlayer;
