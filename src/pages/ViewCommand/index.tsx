import AddCircleIcon from '@mui/icons-material/AddCircle';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  SvgIconProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router-dom';
import 'react-vertical-timeline-component/style.min.css';
import AutocompleteProducts from '../../components/AutocompleteProducts';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import useCommand from '../../hooks/useCommand';
import useProducts from '../../hooks/useProducts';
import { CardsClubIcon, CardsDiamondIcon, CardsHeartIcon, CardsSpadeIcon } from '../../icons';
import updateCommand from '../../resources/commands/updateCommand';
import updateProductStock from '../../resources/products/updateProductStock';
import addSale from '../../resources/sales/addSale';
import routesNames from '../../routes/routesNames';
import { auth } from '../../services/firebaseConfig';
import { formatterCurrencyBRL } from '../../utils/formatters';

type ViewCommandParams = {
  id: string;
};

type CommandItemShoppingCart = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

const cardsSuitiesMap: Record<'club' | 'diamond' | 'heart' | 'spade', React.FC<SvgIconProps>> = {
  club: CardsClubIcon,
  diamond: CardsDiamondIcon,
  heart: CardsHeartIcon,
  spade: CardsSpadeIcon,
};

const cardsStatusMap: Record<'open' | 'closed' | 'canceled', React.FC> = {
  open: () => <Chip label="ABERTA" variant="outlined" color="success" />,
  closed: () => <Chip label="FECHADA" variant="outlined" color="error" />,
  canceled: () => <Chip label="CANCELADA" variant="outlined" color="warning" />,
};

const CommandTitleName = ({ command }: { command: Command }) => {
  const [num, suite] = command.name.split('|');

  const IconComponent = cardsSuitiesMap[suite as 'club' | 'diamond' | 'heart' | 'spade'];

  const StatusComponent = cardsStatusMap[command.status];

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h4" color="textPrimary">
          {num}
        </Typography>
        <IconComponent fontSize="large" />
      </Box>
      <StatusComponent />
    </Box>
  );
};

const ViewCommand: React.FC = () => {
  const [user] = useAuthState(auth);

  const queryClient = useQueryClient();

  const { id } = useParams<ViewCommandParams>();

  const { data: command, isLoading: commandIsLoading, error: commandError } = useCommand(id);

  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<{ id: string; name: string; amount: number; price: number }[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const commandIsClosed = useMemo(() => {
    if (command) {
      return command.status === 'closed';
    }

    return false;
  }, [command]);

  const commandIsCanceled = useMemo(() => {
    if (command) {
      return command.status === 'canceled';
    }

    return false;
  }, [command]);

  const isDisableCommandEdition = useMemo(
    () => commandIsClosed || commandIsCanceled,
    [commandIsClosed, commandIsCanceled]
  );

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

  const handlePlusOneProductInShoppingCart = (row: CommandItemShoppingCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = newArray[index].amount + 1;

      setShoppingCart(newArray);
    }
  };

  const handleMinusOneProductInShoppingCart = (row: CommandItemShoppingCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = Math.max(1, newArray[index].amount - 1);

      setShoppingCart(newArray);
    }
  };

  const handleRemoveProductInShoppingCart = (row: CommandItemShoppingCart) => {
    setShoppingCart((old) => old.filter((elem) => elem.id !== row.id));
  };

  const totalToPay = useMemo(() => {
    return shoppingCart.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
  }, [shoppingCart]);

  const { mutate: updateCommandMutate, isLoading: updateCommandMutateIsloading } = useMutation({
    mutationFn: async () => {
      if (command) {
        await updateCommand({ ...command, products: shoppingCart });
      }

      await queryClient.invalidateQueries(['useCommands', 'open']);

      await queryClient.invalidateQueries(['useCommand', id]);
    },
    onSuccess: () => {
      toast.success('Comanda Atualizada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: closeCommandMutate, isLoading: closeCommandMutateIsloading } = useMutation({
    mutationFn: async () => {
      if (command && user) {
        await updateCommand({ ...command, status: 'closed' });

        await queryClient.invalidateQueries(['useCommands', 'open']);

        await queryClient.invalidateQueries(['useCommand', id]);

        // Atualiza todos os produtos de acorodo com a quantidade para remover do estoque
        await Promise.all(shoppingCart.map(({ id, amount }) => updateProductStock(id, -amount)));

        // // Criando uma nova compra
        await addSale({
          createdAt: Timestamp.now(),
          playerId: '',
          products: shoppingCart.map(({ id, name, amount, price }) => ({
            id,
            name,
            amount,
            price,
          })),
          userId: user.uid,
        });

        await queryClient.invalidateQueries(['useProducts']);

        await queryClient.invalidateQueries(['useSales']);
      } else {
        throw new Error('Usuário não cadastrado');
      }
    },
    onSuccess: () => {
      toast.success('Comanda Atualizada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: cancelCommandMutate, isLoading: cancelCommandMutateIsloading } = useMutation({
    mutationFn: async () => {
      if (command) {
        await updateCommand({ ...command, status: 'canceled' });
      }

      await queryClient.invalidateQueries(['useCommands', 'open']);

      await queryClient.invalidateQueries(['useCommand', id]);
    },
    onSuccess: () => {
      toast.success('Comanda Atualizada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isLoading = useMemo(
    () =>
      commandIsLoading || updateCommandMutateIsloading || closeCommandMutateIsloading || cancelCommandMutateIsloading,
    [commandIsLoading, updateCommandMutateIsloading, closeCommandMutateIsloading || cancelCommandMutateIsloading]
  );

  useEffect(() => {
    if (command) {
      setShoppingCart(command.products);
    }
  }, [command]);

  if (commandError) {
    return <Navigate to={routesNames.NOT_FOUND} />;
  }

  return (
    <Page loading={isLoading}>
      <PageHeader title="Comanda" containsBackButton />
      <Box m={1} height={1}>
        <Grid container spacing={1}>
          {command && (
            <Grid item xs={12}>
              <CommandTitleName command={command} />
            </Grid>
          )}
          <Grid item xs={12}>
            <AutocompleteProducts
              disabled={isDisableCommandEdition}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              validProdutos={validProdutos}
              onClickAddProductButton={handleAddProductToShoppingCart}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
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
                    {shoppingCart
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((row) => (
                        <TableRow key={row.name}>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="inherit">{row.name}</Typography>
                              {!isDisableCommandEdition && (
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
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell align="right">{formatterCurrencyBRL.format(row.price)}</TableCell>
                          <TableCell align="right">{formatterCurrencyBRL.format(row.amount * row.price)}</TableCell>
                        </TableRow>
                      ))}
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
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              color="warning"
              variant="outlined"
              startIcon={<BlockIcon />}
              disabled={isDisableCommandEdition}
              onClick={() => cancelCommandMutate()}
              fullWidth
            >
              Cancelar Comanda
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<DoneAllIcon />}
              disabled={isDisableCommandEdition}
              onClick={() => closeCommandMutate()}
              fullWidth
            >
              Fechar Comanda
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isDisableCommandEdition}
              onClick={() => updateCommandMutate()}
              fullWidth
            >
              Salvar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default ViewCommand;
