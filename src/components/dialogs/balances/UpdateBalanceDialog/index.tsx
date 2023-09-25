import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useProducts from '../../../../hooks/useProducts';
import updatePlayer from '../../../../resources/players/updatePlayer';
import { formatterCurrencyBRL } from '../../../../utils/formatters';
import AvatarPlayer from '../../../AvatarPlayer';
import TypographyBalance from '../../../Typography';

type UpdateBalanceDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: Player;
};

const UpdateBalanceDialog: React.FC<UpdateBalanceDialogProps & DialogProps> = ({
  title,
  subTitle,
  playerToUpdate,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<ItemShoppingCart[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const validProdutos = useMemo(() => {
    if (produtos && shoppingCart) {
      return produtos.filter((product) => !shoppingCart.some((elem) => elem.id === product.id));
    }

    return [];
  }, [produtos, shoppingCart]);

  const handleAddProductToShoppingCart = () => {
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

  const handleMinusOneProductInShoppingCart = (row: ItemShoppingCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = Math.max(1, newArray[index].amount - 1);

      setShoppingCart(newArray);
    }
  };

  const handleRemoveProductInShoppingCart = (row: ItemShoppingCart) => {
    setShoppingCart((old) => old.filter((elem) => elem.id !== row.id));
  };

  const { mutate: updateFiadoMutate, isLoading: updateFiadoMutateIsloading } = useMutation({
    mutationFn: async () => {
      await updatePlayer({ ...playerToUpdate, balance: playerToUpdate.balance - totalToPay });

      await queryClient.invalidateQueries(['usePlayers']);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <AvatarPlayer player={playerToUpdate} />
            <Typography variant="h4">{playerToUpdate.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TypographyBalance variant="h4" balance={playerToUpdate.balance} />
            <ArrowForwardIcon fontSize="large" />
            <TypographyBalance variant="h4" balance={playerToUpdate.balance - totalToPay} />
          </Stack>
        </Box>
        <Stack direction="row" spacing={2} my={2}>
          <Autocomplete
            value={selectedProduct}
            options={validProdutos}
            onChange={(_, newValue) => {
              setSelectedProduct(newValue);
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Typography flexGrow={1}>{option.name}</Typography>
                <Typography color="GrayText">{formatterCurrencyBRL.format(option.price)}</Typography>
              </Box>
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            fullWidth
            renderInput={(params) => <TextField {...params} ref={null} size="small" label="Produtos" />}
          />
          <IconButton color="success" disabled={!selectedProduct} onClick={handleAddProductToShoppingCart}>
            <AddCircleIcon />
          </IconButton>
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
                        <IconButton size="small" onClick={() => handleMinusOneProductInShoppingCart(row)}>
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
                  <TableCell colSpan={4}>Nenhum Produto Selecionado</TableCell>
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
        <Button disabled={totalToPay <= 0} onClick={() => updateFiadoMutate()}>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={updateFiadoMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdateBalanceDialog;
