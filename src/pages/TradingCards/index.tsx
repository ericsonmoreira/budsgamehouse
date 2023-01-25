import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddTradingCardDialog from "../../components/AddTradingCardDialog";
import useTradingCards from "../../hooks/useTradingCards";

const TradingCards: React.FC = () => {
  const [addTradingCardDialogOpen, setAddTradingCardDialogOpen] =
    useState(false);

  const { cards: wantedCards, deleteTradingCard } = useTradingCards();

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Cartas de Troca</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddTradingCardDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Imagem</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Açoes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wantedCards?.map(({ id, name, imgUrl, amount }) => (
                <TableRow
                  key={id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell scope="row">
                    <Tooltip
                      PopperProps={{ sx: { backgroundColor: "none" } }}
                      title={
                        <img
                          src={imgUrl}
                          style={{ height: 300, marginTop: 5 }}
                        />
                      }
                    >
                      <img src={imgUrl} style={{ height: "2rem" }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="body2">{name}</Typography>
                  </TableCell>
                  <TableCell align="right">{amount}</TableCell>
                  <TableCell align="right">
                    <Box>
                      <Tooltip title="Deletar">
                        <IconButton
                          color="error"
                          onClick={() => deleteTradingCard(id)}
                        >
                          <RemoveCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton color="info">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AddTradingCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas de troca"
        open={addTradingCardDialogOpen}
        setOpen={setAddTradingCardDialogOpen}
        onClose={() => setAddTradingCardDialogOpen(false)}
      />
    </>
  );
};

export default TradingCards;
