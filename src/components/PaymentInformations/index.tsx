import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import TypographyBalance from '../TypographyBalance';

type PaymentInformationsProps = {
  data: Payment;
};

const PaymentInformations: React.FC<PaymentInformationsProps> = ({ data }) => {
  return (
    <Paper>
      <Box p={1}>
        <Typography component="section" variant="h6" gutterBottom>
          Pagamento
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Saldo Anterior</TableCell>
                <TableCell align="right">Pagamento</TableCell>
                <TableCell align="right">Saldo Atualizado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TypographyBalance component="section" balance={data.previousPlayerBalance} />
                </TableCell>
                <TableCell align="right">
                  <TypographyBalance component="section" balance={data.value} />
                </TableCell>
                <TableCell align="right">
                  <TypographyBalance component="section" balance={data.currentPlayerBalance} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {data.description && (
          <Box mt={1}>
            <Typography gutterBottom component="section">
              Descrição
            </Typography>
            <Typography component="section" color="text.secondary">
              {data.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PaymentInformations;
