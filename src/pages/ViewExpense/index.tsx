import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import TypographyBalance from "@/components/TypographyBalance";
import useExpense from "@/hooks/useExpense";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

type ViewExpenseParams = {
  id: string;
};

function ViewExpense() {
  const { id } = useParams<ViewExpenseParams>();

  const { data: expense, isLoading } = useExpense(id);

  return (
    <Page loading={isLoading}>
      <PageHeader title="Despesas" containsBackButton />
      <Box m={1} height={1}>
        {expense && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {expense.name}
              </Typography>
              <Typography color="text.secondary">
                {expense.description}
              </Typography>
              <TypographyBalance balance={-expense.value} />
              <Box mt={1}>
                <Typography gutterBottom>Produtos</Typography>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ flex: 1 }}>Produto</TableCell>
                      <TableCell
                        width="20%"
                        style={{ minWidth: 100 }}
                        align="right"
                      >
                        Quantidade
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expense.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.amount}</TableCell>
                      </TableRow>
                    ))}
                    {expense.products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          Nenhum Produto Selecionado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Page>
  );
}

export default ViewExpense;
