import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import TypographyBalance from "../TypographyBalance";

type PaymentInformationsProps = {
  data: Payment;
};

function PaymentInformations({ data }: PaymentInformationsProps) {
  return (
    <Paper>
      <Box p={1}>
        <Typography component="section" variant="h6" gutterBottom>
          Pagamento
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <CalendarMonthIcon fontSize="small" />
          <Typography>
            {format(data.createdAt.toDate(), "PPPp", { locale: ptBR })}
          </Typography>
        </Stack>
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
                  <TypographyBalance
                    component="section"
                    balance={data.previousPlayerBalance}
                  />
                </TableCell>
                <TableCell align="right">
                  <TypographyBalance component="section" balance={data.value} />
                </TableCell>
                <TableCell align="right">
                  <TypographyBalance
                    component="section"
                    balance={data.currentPlayerBalance}
                  />
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
}

export default PaymentInformations;
