import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import usePlayer from '../../hooks/usePlayer';
import TypographyBalance from '../TypographyBalance';

type TransferInformationsProps = {
  data: Transfer;
};

const TransferInformations: React.FC<TransferInformationsProps> = ({ data }) => {
  const { receiverPlayerId, sendingPlayerId, value, description } = data;

  const { data: receiverPlayer } = usePlayer(receiverPlayerId);

  const { data: sendingPlayer } = usePlayer(sendingPlayerId);

  return (
    <Paper>
      <Box p={1}>
        <Typography component="section" variant="h6" gutterBottom>
          Transferência
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <CalendarMonthIcon fontSize="small" />
          <Typography>{format(data.createdAt.toDate(), 'PPPp', { locale: ptBR })}</Typography>
        </Stack>
        <Typography component="section">Remetente: {sendingPlayer?.name}</Typography>
        <Typography component="section">Recebedor: {receiverPlayer?.name}</Typography>
        {description && (
          <>
            <Typography component="section">Descrição</Typography>
            <Typography component="section" color="text.secondary">
              {description}
            </Typography>
          </>
        )}
        <TypographyBalance component="section" balance={value} />
      </Box>
    </Paper>
  );
};

export default TransferInformations;
