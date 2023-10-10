import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Card, CardContent, CardHeader, Container, Stack, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import AvatarPlayer from '../../components/AvatarPlayer';
import Page from '../../components/Page';
import PaymentInformations from '../../components/PaymentInformations';
import SaleInformationsTable from '../../components/SaleInformationsTable';
import TypographyBalance from '../../components/Typography';
import usePaymentsFromPlayer from '../../hooks/usePaymentsFromPlayer';
import usePlayer from '../../hooks/usePlayer';
import useSalesFromPlayer from '../../hooks/useSalesFromPlayer';

type ViewClientParams = {
  id: string;
};

const ViewClient: React.FC = () => {
  const { id } = useParams<ViewClientParams>();

  const { palette, spacing } = useTheme();

  const { data: player, isLoading } = usePlayer(id);

  const { data: sales } = useSalesFromPlayer(id);

  const { data: payments } = usePaymentsFromPlayer(id);

  const playerActivities = useMemo<Array<Sale | Payment>>(() => {
    if (sales && payments) {
      return [...sales, ...payments].sort((a, b) => b.createdAt - a.createdAt);
    }

    return [];
  }, [sales, payments]);

  const isSale = (obj: object): boolean => {
    return 'products' in obj;
  };

  return (
    <Page loading={isLoading}>
      <Box height="100vh" display="flex" flexDirection="column">
        <Container maxWidth="lg">
          <Box p={1}>
            {player && (
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
            )}
            {playerActivities.map((activite) => (
              <VerticalTimeline key={activite.id} lineColor={palette.text.secondary}>
                <VerticalTimelineElement
                  position={isSale(activite) ? 'right' : 'lefth'}
                  date={format(activite.createdAt.toDate(), 'PPPp', { locale: ptBR })}
                  icon={isSale(activite) ? <ShoppingCartIcon /> : <AttachMoneyIcon />}
                  iconStyle={{
                    background: isSale(activite) ? palette.primary.main : palette.success.main,
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
                >
                  {isSale(activite) ? (
                    <SaleInformationsTable key={activite.id} data={activite as Sale} />
                  ) : (
                    <Box>
                      <PaymentInformations data={activite as Payment} />
                    </Box>
                  )}
                </VerticalTimelineElement>
              </VerticalTimeline>
            ))}
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default ViewClient;
