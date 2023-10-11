import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import usePaymentsFromPlayer from '../../hooks/usePaymentsFromPlayer';
import useSalesFromPlayer from '../../hooks/useSalesFromPlayer';
import PaymentInformations from '../PaymentInformations';
import SaleInformations from '../SaleInformations';

type PlayerActivitiesTimeLineProps = {
  data: Player;
};

const PlayerActivitiesTimeLine: React.FC<PlayerActivitiesTimeLineProps> = ({ data }) => {
  const { palette, spacing } = useTheme();

  const { id } = data;

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
    <VerticalTimeline lineColor={palette.text.secondary}>
      {playerActivities.map((activite) => (
        <VerticalTimelineElement
          key={activite.id}
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
            <SaleInformations key={activite.id} data={activite as Sale} />
          ) : (
            <Box>
              <PaymentInformations data={activite as Payment} />
            </Box>
          )}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default PlayerActivitiesTimeLine;
