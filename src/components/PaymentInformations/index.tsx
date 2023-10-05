import { Box, Typography } from '@mui/material';
import React from 'react';
import TypographyBalance from '../Typography';

type PaymentInformationsProps = {
  data: Payment;
};

const PaymentInformations: React.FC<PaymentInformationsProps> = ({ data }) => {
  return (
    <Box>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <Typography>Valor do pagamento</Typography>
        <TypographyBalance variant="h5" balance={data.value} />
      </Box>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <Typography>Saldo Anterior</Typography>
        <TypographyBalance variant="h5" balance={data.previousPlayerBalance} />
      </Box>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <Typography>Saldo Atualizado</Typography>
        <TypographyBalance variant="h5" balance={data.currentPlayerBalance} />
      </Box>
      <Typography>Descrição: {data.description}</Typography>
    </Box>
  );
};

export default PaymentInformations;
