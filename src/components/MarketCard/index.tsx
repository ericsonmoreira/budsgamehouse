import { yupResolver } from '@hookform/resolvers/yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import React, { useCallback, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import usePlayers from '../../hooks/usePlayers';
import useProducts from '../../hooks/useProducts';
import updateProductStock from '../../resources/products/updateProductStock';
import addSale from '../../resources/sales/addSale';
import { auth } from '../../services/firebaseConfig';
import { formatterCurrencyBRL } from '../../utils/formatters';
import AutocompletePlayers from '../AutocompletePlayers';
import AutocompleteProducts from '../AutocompleteProducts';
import ControlledCurrencyTextField from '../textfields/ControlledCurrencyTextField';
import schema from './schema';

type MarketCardCart = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

type MarketCardFormData = {
  looseValue: number;
};

const MarketCard: React.FC = () => {
  const [user] = useAuthState(auth);

  const {
    data: players,
    // isLoading: isLoadingPlayers
  } = usePlayers();

  const {
    data: products,
    // isLoading: isLoadingProducts
  } = useProducts();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [shoppingCart, setShoppingCart] = useState<{ id: string; name: string; amount: number; price: number }[]>([]);

  const { handleSubmit, control, watch, resetField } = useForm<MarketCardFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      looseValue: 0,
    },
  });

  const looseValueWatch = watch('looseValue');

  const validProdutos = useMemo(() => {
    if (products && shoppingCart) {
      return products.filter((product) => !shoppingCart.some((elem) => elem.id === product.id));
    }

    return [];
  }, [products, shoppingCart]);

  const handleAddProductToShoppingCart = () => {
    if (selectedProduct) {
      setShoppingCart((old) => [{ amount: 1, ...selectedProduct }, ...old]);

      setSelectedProduct(null);
    }
  };

  const handlePlusOneProductInShoppingCart = (row: MarketCardCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = newArray[index].amount + 1;

      setShoppingCart(newArray);
    }
  };

  const handleMinusOneProductInShoppingCart = (row: MarketCardCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = Math.max(1, newArray[index].amount - 1);

      setShoppingCart(newArray);
    }
  };

  const handleRemoveProductInShoppingCart = (row: MarketCardCart) => {
    setShoppingCart((old) => old.filter((elem) => elem.id !== row.id));
  };

  const totalToPay = useMemo(() => {
    return shoppingCart.reduce((acc, curr) => acc + curr.price * curr.amount, 0) + looseValueWatch;
  }, [shoppingCart, looseValueWatch]);

  const disabledConfirm = useMemo(() => totalToPay === 0, [totalToPay]);

  const { mutate: confirmMutate, isLoading: confirmMutateIsloading } = useMutation({
    mutationFn: async (data: MarketCardFormData) => {
      if (user) {
        const { looseValue } = data;

        // Atualiza todos os produtos de acorodo com a quantidade para remover do estoque
        await Promise.all(shoppingCart.map(({ id, amount }) => updateProductStock(id, -amount)));

        // // Criando uma nova compra
        await addSale({
          createdAt: Timestamp.now(),
          playerId: selectedPlayer?.id || '',
          products: shoppingCart.map(({ id, name, amount, price }) => ({
            id,
            name,
            amount,
            price,
          })),
          userId: user.uid,
          looseValue,
        });
      } else {
        throw new Error('Usuário não encontrado.');
      }
    },
    onSuccess: () => {
      handleClearFields();

      toast.success('Venda realizada com Sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleClearFields = useCallback(() => {
    setShoppingCart([]);

    resetField('looseValue');

    setSelectedPlayer(null);
  }, [setShoppingCart, resetField, setSelectedPlayer]);

  const handleConfirm = (data: MarketCardFormData) => {
    confirmMutate(data);
  };

  return (
    <Card>
      <CardHeader title="Caixa Aberto" subheader="Criar uma venda associada ou não a um Player" />
      {players && products && (
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AutocompletePlayers
                validPlayers={players}
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
              />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteProducts
                validProdutos={validProdutos}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                onClickAddProductButton={handleAddProductToShoppingCart}
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledCurrencyTextField
                control={control}
                name="looseValue"
                label="Valor em cartas avulsas"
                fullWidth
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Produtos selecioandos</Typography>
              <TableContainer component={Paper} variant="outlined">
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
                    {shoppingCart
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((row) => (
                        <TableRow key={row.name}>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="inherit">{row.name}</Typography>

                              <Stack direction="row">
                                <IconButton onClick={() => handlePlusOneProductInShoppingCart(row)}>
                                  <AddCircleIcon fontSize="inherit" color="success" />
                                </IconButton>
                                <IconButton onClick={() => handleMinusOneProductInShoppingCart(row)}>
                                  <RemoveCircleIcon fontSize="inherit" color="error" />
                                </IconButton>
                                <IconButton onClick={() => handleRemoveProductInShoppingCart(row)}>
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" flexDirection="row" justifyContent="space-between" width="100%">
                <Typography variant="h5">Total</Typography>
                <Typography variant="h5">{formatterCurrencyBRL.format(totalToPay)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      )}
      <CardActions>
        <Button variant="contained" color="error" onClick={handleClearFields}>
          Cancelar
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmit(handleConfirm)} disabled={disabledConfirm}>
          Finalizar Pedido
        </Button>
      </CardActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={confirmMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Card>
  );
};

export default MarketCard;
