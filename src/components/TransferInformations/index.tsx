import { Box, Paper, Typography } from '@mui/material';
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
