import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import 'react-vertical-timeline-component/style.min.css';
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

const CommandTitleName = ({ command }: { command: Command }) => {
  const [num, suite] = command.name.split('|');

  const IconComponent = cardsSuitiesMap[suite as 'club' | 'diamond' | 'heart' | 'spade'];

  return (
    <Stack direction="row" spacing={1} alignContent="center">
      <Typography variant="h4" color="textPrimary">
        Comanda {num}
      </Typography>
      <IconComponent fontSize="large" />
    </Stack>
  );
};

const ViewCommand: React.FC = () => {
  const navigate = useNavigate();

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
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        {command && <CommandTitleName command={command} />}
      </Box>
      <Box m={1} height={1}>
        <Stack direction="row" spacing={2} my={2}>
          <Autocomplete
            disabled={isDisableCommandEdition}
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
          <IconButton color="success" onClick={() => handleAddProductToShoppingCart()} disabled={!selectedProduct}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
        {command && (
          <Typography color="GrayText" gutterBottom>
            Status: {command.status}
          </Typography>
        )}
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
        <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
          <Button
            color="warning"
            startIcon={<BlockIcon />}
            disabled={isDisableCommandEdition}
            onClick={() => cancelCommandMutate()}
          >
            Cancelar Comanda
          </Button>
          <Button
            variant="contained"
            startIcon={<DoneAllIcon />}
            disabled={isDisableCommandEdition}
            onClick={() => closeCommandMutate()}
          >
            Fechar Comanda
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isDisableCommandEdition}
            onClick={() => updateCommandMutate()}
          >
            Salvar
          </Button>
        </Stack>
      </Box>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewCommand;
