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
import AddWantCardDialog from "../../components/AddWantCardDialog";

const imageUrlExample =
  "https://repositorio.sbrauble.com/arquivos/in/magic/425127/5f42441674d8c-3vgfy6-kvnoz0-69adc1e107f7f7d035d7baf04342e1ca.jpg";

const createData = (name: string, amount: number) => ({
  name,
  amount,
  imageUrl: imageUrlExample,
});

const rows = [
  createData("Goblin Piledriver1", 1),
  createData("Goblin Piledriver2", 2),
  createData("Goblin Piledriver3", 3),
  createData("Goblin Piledriver4", 4),
  createData("Goblin Piledriver5", 5),
];

const WantedCards: React.FC = () => {
  const [addWantCardDialogOpen, setAddWantCardDialogOpen] = useState(false);
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
        <Typography variant="h4">Want List</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddWantCardDialogOpen(true)}
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
              {rows.map(({ name, amount, imageUrl }) => (
                <TableRow
                  key={name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell scope="row">
                    <Tooltip
                      PopperProps={{ sx: { backgroundColor: "none" } }}
                      title={
                        <img
                          src={imageUrl}
                          style={{ height: 300, marginTop: 5 }}
                        />
                      }
                    >
                      <img src={imageUrl} style={{ height: "2rem" }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="body2">{name}</Typography>
                  </TableCell>
                  <TableCell align="right">{amount}</TableCell>
                  <TableCell align="right">
                    <Box>
                      <Tooltip title="Deletar">
                        <IconButton color="error">
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
      <AddWantCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas para encontrar"
        open={addWantCardDialogOpen}
        setOpen={setAddWantCardDialogOpen}
        onClose={() => setAddWantCardDialogOpen(false)}
      />
    </>
  );
};

export default WantedCards;
