import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { formatterCurrencyBRL } from '../../utils/formatters';

type SaleInformationsProps = {
  data: Sale;
};

const SaleInformations: React.FC<SaleInformationsProps> = ({ data }) => {
  const totalSum = useMemo(() => data.products.reduce((acc, curr) => acc + curr.amount * curr.price, 0), [data]);

  return (
    <Paper>
      <Box p={1}>
        <Typography component="section" variant="h6" gutterBottom>
          Consumo
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <CalendarMonthIcon fontSize="small" />
          <Typography>{format(data.createdAt.toDate(), 'PPPp', { locale: ptBR })}</Typography>
        </Stack>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="right">Quant.</TableCell>
                <TableCell align="right">V. Unit.</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.amount}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(product.price)}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(product.price * product.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell align="right">{formatterCurrencyBRL.format(totalSum)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default SaleInformations;
