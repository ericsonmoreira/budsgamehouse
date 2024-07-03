import PaidIcon from '@mui/icons-material/Paid';
import { Box, Button, Card, CardContent, CardHeader, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvatarPlayer from '../../components/AvatarPlayer';
import Page from '../../components/Page';
import PlayerExtract from '../../components/PlayerExtract';
import TypographyBalance from '../../components/TypographyBalance';
import usePlayer from '../../hooks/usePlayer';

type ViewClientParams = {
  id: string;
};

const ViewClient: React.FC = () => {
  const { id } = useParams<ViewClientParams>();

  const navigate = useNavigate();

  const { data: player, isLoading } = usePlayer(id);

  return (
    <Page loading={isLoading}>
      <Box height="100vh" display="flex" flexDirection="column">
        <Container maxWidth="lg">
          <Box p={1}>
            <Box mb={1}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Voltar
              </Button>
            </Box>
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
                    <Typography color="GrayText">Email: {player.email}</Typography>
                  </CardContent>
                </Card>
                <Box mt={1}>
                  <PlayerExtract player={player} />
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default ViewClient;
