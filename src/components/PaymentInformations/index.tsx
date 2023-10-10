import { Box, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import TypographyBalance from '../Typography';

type PaymentInformationsProps = {
  data: Payment;
};

const PaymentInformations: React.FC<PaymentInformationsProps> = ({ data }) => {
  return (
    <Paper>
      <Stack spacing={1} p={1}>
        <Box display="flex" alignItems="flex-end" justifyContent="space-between">
          <Typography variant="body1">Valor do pagamento</Typography>
          <TypographyBalance variant="body1" balance={data.value} />
        </Box>
        <Box display="flex" alignItems="flex-end" justifyContent="space-between">
          <Typography variant="body1">Saldo Anterior</Typography>
          <TypographyBalance variant="body1" balance={data.previousPlayerBalance} />
        </Box>
        <Box display="flex" alignItems="flex-end" justifyContent="space-between">
          <Typography variant="body1">Saldo Atualizado</Typography>
          <TypographyBalance variant="body1" balance={data.currentPlayerBalance} />
        </Box>
        <Typography>Descrição: {data.description}</Typography>
      </Stack>
    </Paper>
  );
};

export default PaymentInformations;
