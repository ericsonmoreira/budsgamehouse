import React from 'react';
import usePlayer from '../../hooks/usePlayer';
import { Box, Paper, Typography } from '@mui/material';
import TypographyBalance from '../Typography';

type TransferInformationsProps = {
  data: Transfer;
};

const TransferInformations: React.FC<TransferInformationsProps> = ({ data }) => {
  const { receiverPlayerId, sendingPlayerId, value } = data;

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
        <TypographyBalance component="section" balance={value} />
      </Box>
    </Paper>
  );
};

export default TransferInformations;
