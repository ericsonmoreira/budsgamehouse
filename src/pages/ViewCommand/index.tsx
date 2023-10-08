import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
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
import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import 'react-vertical-timeline-component/style.min.css';
import useCommand from '../../hooks/useCommand';
import useProducts from '../../hooks/useProducts';
import { CardsClubIcon, CardsDiamondIcon, CardsHeartIcon, CardsSpadeIcon } from '../../icons';
import routesNames from '../../routes/routesNames';
import { formatterCurrencyBRL } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCommand from '../../resources/commands/updateCommand';

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

  const queryClient = useQueryClient();

  const { id } = useParams<ViewCommandParams>();

  const { data: command, isLoading: commandIsLoading, error: commandError } = useCommand(id);

  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<{ id: string; name: string; amount: number; price: number }[]>([]); // TODO: usar isso para cadastrar os produtos

  const newCommandProducts = useMemo(() => {
    if (shoppingCart && command) {
      return [...command.products, ...shoppingCart];
    }

    return [];
  }, [command, shoppingCart]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const validProdutos = useMemo(() => {
    if (produtos && newCommandProducts) {
      return produtos.filter((product) => !newCommandProducts.some((elem) => elem.id === product.id));
    }

    return [];
  }, [produtos, newCommandProducts]);

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
    return newCommandProducts.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
  }, [newCommandProducts]);

  const { mutate: updateCommandMutate, isLoading: updatecOMMANDMutateIsloading } = useMutation({
    mutationFn: async () => {
      if (command) {
        await updateCommand({ ...command, products: [...command.products, ...shoppingCart] });
      }

      setShoppingCart([]);

      await queryClient.invalidateQueries(['useCommands']);

      await queryClient.invalidateQueries(['useCommand', id]);
    },
    onSuccess: () => {
      toast.success('Comanda Atualizada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

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
                {newCommandProducts.map((row) => (
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
          <Button>Cancelar Comanda</Button>
          <Button variant="contained" onClick={() => updateCommandMutate()}>
            Salvar
          </Button>
        </Stack>
      </Box>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={commandIsLoading || updatecOMMANDMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewCommand;
