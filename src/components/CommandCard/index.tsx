import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import routesNames from '../../routes/routesNames';
import CommandTitleName from '../CommandTitleName';
import TypographyBalance from '../TypographyBalance';

type CommandCardProps = {
  data: Command;
};

const CommandCard: React.FC<CommandCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const total = useMemo(() => {
    return data.products.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
  }, [data]);

  return (
    <ButtonBase
      TouchRippleProps={{ center: false }}
      sx={{ width: '100%' }}
      onClick={() => navigate(routesNames.VIEW_COMMAND.replace(':id', data.id))}
    >
      <Paper sx={{ width: '100%' }}>
        <Box p={2}>
          <CommandTitleName command={data} />
          <Typography variant="h6">Cliente: {data.displayName || 'Não Informado'}</Typography>
          <TypographyBalance variant="h4" balance={total} />
          <Typography variant="caption" color="GrayText">
            Aberto em {format(data.createdAt, 'PPPp', { locale: ptBR })}
          </Typography>
        </Box>
      </Paper>
    </ButtonBase>
  );
};

export default CommandCard;
