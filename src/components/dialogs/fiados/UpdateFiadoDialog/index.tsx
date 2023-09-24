import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { useMemo, useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import { formatterCurrencyBRL } from '../../../../utils/formatters';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import usePlayer from '../../../../hooks/usePlayer';
import AvatarPlayer from '../../../AvatarPlayer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';

type ItemShoppingCart = {
  amount: number;
} & Product;

type UpdateFiadoDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fiadoToUpdate: Fiado;
};

const UpdateFiadoDialog: React.FC<UpdateFiadoDialogProps & DialogProps> = ({
  title,
  subTitle,
  fiadoToUpdate,
  setOpen,
  ...rest
}) => {
  const { data: produtos } = useProducts();

  const { data: player } = usePlayer(fiadoToUpdate.playerId);

  const [shoppingCart, setShoppingCart] = useState<ItemShoppingCart[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const validProdutos = useMemo(() => {
    if (produtos && shoppingCart) {
      return produtos.filter((product) => !shoppingCart.some((elem) => elem.id === product.id));
    }
    return [];
  }, [produtos, shoppingCart]);

  const handleAddProductToShoppingCart = () => {
    console.log(selectedProduct);

    if (selectedProduct) {
      setShoppingCart((old) => [{ amount: 1, ...selectedProduct }, ...old]);

      setSelectedProduct(null);
    }
  };

  const totalToPay = useMemo(
    () => shoppingCart.reduce((acc, curr) => acc + curr.amount * curr.price, 0),
    [shoppingCart]
  );

  const handleClose = () => {
    setOpen(false);

    setSelectedProduct(null);

    setShoppingCart([]);
  };

  function handlePlusOneProductInShoppingCart(row: ItemShoppingCart): void {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = newArray[index].amount + 1;

      setShoppingCart(newArray);
    }
  }

  function handlePlusMinusProductInShoppingCart(row: ItemShoppingCart): void {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = Math.max(1, newArray[index].amount - 1);

      setShoppingCart(newArray);
    }
  }

  function handleRemoveProductInShoppingCart(row: ItemShoppingCart): void {
    setShoppingCart((old) => old.filter((elem) => elem.id !== row.id));
  }

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        {player && (
          <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarPlayer player={player} />
              <Typography variant="h4">{player.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4">{formatterCurrencyBRL.format(fiadoToUpdate.value)}</Typography>
              <ArrowForwardIcon fontSize="large" />
              <Typography variant="h4">{formatterCurrencyBRL.format(fiadoToUpdate.value + totalToPay)}</Typography>
            </Stack>
          </Box>
        )}
        <Stack direction="row" spacing={2} my={2}>
          <Autocomplete
            value={selectedProduct}
            options={validProdutos}
            onChange={(_, newValue) => {
              setSelectedProduct(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            fullWidth
            renderInput={(params) => <TextField {...params} ref={null} size="small" label="Produtos" />}
          />
          <Button variant="contained" disabled={!selectedProduct} onClick={handleAddProductToShoppingCart}>
            Adicionar
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Valor Unit.</TableCell>
                <TableCell align="right" width={150}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shoppingCart.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="inherit">{row.name}</Typography>
                      <Stack direction="row">
                        <IconButton size="small" onClick={() => handlePlusOneProductInShoppingCart(row)}>
                          <AddCircleIcon fontSize="inherit" color="success" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handlePlusMinusProductInShoppingCart(row)}>
                          <RemoveCircleIcon fontSize="inherit" color="error" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleRemoveProductInShoppingCart(row)}>
                          <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(row.price)}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(row.amount * row.price)}</TableCell>
                </TableRow>
              ))}
              {shoppingCart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum Produto</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Total a Pagar</Typography>
                    <Typography variant="h6" color="error">
                      {formatterCurrencyBRL.format(totalToPay)}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button autoFocus>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFiadoDialog;
