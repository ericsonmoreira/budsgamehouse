import { Box, ButtonBase, Paper, SvgIconProps, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { CardsClubIcon, CardsDiamondIcon, CardsHeartIcon, CardsSpadeIcon } from '../../icons';
import TypographyBalance from '../Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type CommandCardProps = {
  data: Command;
};

const cardsSuitiesMap: Record<'club' | 'diamond' | 'heart' | 'spade', React.FC<SvgIconProps>> = {
  club: CardsClubIcon,
  diamond: CardsDiamondIcon,
  heart: CardsHeartIcon,
  spade: CardsSpadeIcon,
};

const CommandCard: React.FC<CommandCardProps> = ({ data }) => {
  const [num, suite] = data.name.split('|');

  const IconComponent = cardsSuitiesMap[suite as 'club' | 'diamond' | 'heart' | 'spade'];

  const total = useMemo(() => {
    return data.products.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
  }, [data]);

  return (
    <ButtonBase TouchRippleProps={{ center: false }} sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <Box p={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="h4">{num}</Typography>
            <IconComponent fontSize="large" />
          </Box>
          <TypographyBalance variant="h4" balance={total} />
          <Typography variant="caption" color="GrayText">
            Aberto em {format(Date.now(), 'PPPp', { locale: ptBR })}
          </Typography>
        </Box>
      </Paper>
    </ButtonBase>
  );
};

export default CommandCard;
