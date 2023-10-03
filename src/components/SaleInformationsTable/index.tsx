import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import React, { useMemo } from 'react';
import { formatterCurrencyBRL } from '../../utils/formatters';

type SaleInformationsTableProps = {
  data: Sale;
};

const SaleInformationsTable: React.FC<SaleInformationsTableProps> = ({ data }) => {
  const totalSum = useMemo(() => data.products.reduce((acc, curr) => acc + curr.amount * curr.price, 0), [data]);

  return (
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
  );
};

export default SaleInformationsTable;
