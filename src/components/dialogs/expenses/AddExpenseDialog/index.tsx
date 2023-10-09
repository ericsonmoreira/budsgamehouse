import { yupResolver } from '@hookform/resolvers/yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useProducts from '../../../../hooks/useProducts';
import AutocompleteProducts from '../../../AutocompleteProducts';
import ControlledCurrencyTextField from '../../../textfields/ControlledCurrencyTextField';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema';

type AddExpenseDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddExpenseDialogFormData = {
  name: string;
  value: number;
  description: string;
  products: {
    id: string;
    name: string;
    amount: number;
  }[];
};

const defaultValues: AddExpenseDialogFormData = {
  description: '',
  name: '',
  products: [],
  value: 0,
};

const AddExpenseDialog: React.FC<AddExpenseDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const { data: produtos } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<AddExpenseDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  const selectedProducts = watch('products');

  const validProdutos = useMemo(() => {
    if (produtos && selectedProducts) {
      return produtos.filter((product) => !fields.some((field) => field.name === product.name));
    }

    return [];
  }, [produtos, selectedProducts]);

  const handleAddProductToShoppingCart = () => {
    if (selectedProduct) {
      append({
        id: selectedProduct.id,
        amount: 1,
        name: selectedProduct.name,
      });

      setSelectedProduct(null);
    }
  };

  const handlePlusOneProductInShoppingCart = (index: number) => {
    update(index, {
      ...fields[index],
      amount: fields[index].amount + 1,
    });
  };

  const handleMinusOneProductInShoppingCart = (index: number) => {
    update(index, {
      ...fields[index],
      amount: Math.max(fields[index].amount - 1),
    });
  };

  const handleRemoveProductInShoppingCart = (index: number) => {
    remove(index);
  };

  const { mutate: addExpenseMutate, isLoading: addExpenseMutateIsloading } = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id'>) => {
      console.log(expense);

      // await queryClient.invalidateQueries(['useProducts']);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = (data: AddExpenseDialogFormData) => {
    // addExpenseMutate(data);
    console.log(data);
  };

  const handleClose = () => {
    reset(defaultValues);

    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest} onClose={handleClose} fullScreen>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField name="name" control={control} variant="outlined" size="small" label="Nome" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="description"
              control={control}
              variant="outlined"
              size="small"
              label="Descrição"
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledCurrencyTextField
              name="value"
              control={control}
              variant="outlined"
              size="small"
              label="Valor"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteProducts
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              validProdutos={validProdutos}
              onClickAddProductButton={handleAddProductToShoppingCart}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ flex: 1 }}>Produto</TableCell>
                    <TableCell width="10%" style={{ minWidth: 20 }} align="right">
                      #
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="inherit">{product.name}</Typography>
                          <Stack direction="row">
                            <IconButton size="small" onClick={() => handlePlusOneProductInShoppingCart(index)}>
                              <AddCircleIcon fontSize="inherit" color="success" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleMinusOneProductInShoppingCart(index)}>
                              <RemoveCircleIcon fontSize="inherit" color="error" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleRemoveProductInShoppingCart(index)}>
                              <DeleteIcon fontSize="inherit" color="error" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{product.amount}</TableCell>
                    </TableRow>
                  ))}
                  {fields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>Nenhum Produto Selecionado</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={addExpenseMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddExpenseDialog;
