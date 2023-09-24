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
  Stack,
  Typography,
} from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import AvatarPlayer from '../../components/AvatarPlayer';
import usePlayer from '../../hooks/usePlayer';
import routesNames from '../../routes/routesNames';
import { formatterCurrencyBRL } from '../../utils/formatters';

type ViewPlayerParams = {
  id: string;
};

const ViewPlayer: React.FC = () => {
  const { id } = useParams<ViewPlayerParams>();

  const { data: player, isLoading: playerIsLoading, error: playerError } = usePlayer(id ?? '');

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
      <Box m={1} display="flex">
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
                  <Typography variant="h6">Fiado</Typography>
                </Stack>

                <Typography variant="h5" color="error">
                  {formatterCurrencyBRL.format(player.balance)}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button variant="outlined" startIcon={<PaymentIcon />}>
                Pagar
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={playerIsLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewPlayer;
