import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useProducts from "../../../../hooks/useProducts";
import addExpense from "../../../../resources/expenses/addExpense";
import updateProductStock from "../../../../resources/products/updateProductStock";
import { auth } from "../../../../services/firebaseConfig";
import AutocompleteProducts from "../../../AutocompleteProducts";
import ControlledCurrencyTextField from "../../../textfields/ControlledCurrencyTextField";
import ControlledTextField from "../../../textfields/ControlledTextField";
import schema from "./schema";

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
    productId: string;
    name: string;
    amount: number;
  }[];
};

const defaultValues: AddExpenseDialogFormData = {
  description: "",
  name: "",
  products: [],
  value: 0,
};

const AddExpenseDialog: React.FC<AddExpenseDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const { data: produtos } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { handleSubmit, reset, control, watch } =
    useForm<AddExpenseDialogFormData>({
      resolver: yupResolver(schema),
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const selectedProducts = watch("products");

  const validProdutos = useMemo(() => {
    if (produtos && selectedProducts) {
      return produtos.filter(
        (product) => !fields.some((field) => field.name === product.name),
      );
    }

    return [];
  }, [produtos, selectedProducts]);

  const handleAddProductToShoppingCart = () => {
    if (selectedProduct) {
      append({
        productId: selectedProduct.id,
        amount: 1,
        name: selectedProduct.name,
      });

      setSelectedProduct(null);
    }
  };

  const handleRemoveProductInShoppingCart = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const { mutate: addExpenseMutate, isPending: addExpenseMutateIsloading } =
    useMutation({
      mutationFn: async ({
        value,
        description,
        name,
        products,
      }: AddExpenseDialogFormData) => {
        if (user) {
          await addExpense({
            value,
            name,
            products: products.map(({ amount, name, productId }) => ({
              id: productId,
              amount,
              name,
            })),
            userId: user.uid,
            description,
            createdAt: Timestamp.now(),
          });

          await Promise.all(
            products.map(({ productId, amount }) =>
              updateProductStock(productId, amount),
            ),
          );

          await queryClient.invalidateQueries({ queryKey: ["useProducts"] });

          // Pegando mês e ano atual
          const [mes, ano] = format(Date.now(), "MM/yyyy").split("/");

          await queryClient.invalidateQueries({
            queryKey: [
              "useExpensesPerMonth",
              new Date(`${ano}-${mes}-01T00:00:00`),
            ],
          });
        } else {
          throw new Error("Usuário não encontrado");
        }
      },
      onSuccess: () => {
        handleClose();

        toast.success("Despesa adicionada com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleConfirmAction = (data: AddExpenseDialogFormData) => {
    addExpenseMutate(data);
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
            <ControlledTextField
              name="name"
              control={control}
              variant="outlined"
              size="small"
              label="Nome"
              fullWidth
            />
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
            <Typography gutterBottom>
              Produdos para entrada em Estoque
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ flex: 1 }}>Produto</TableCell>
                    <TableCell
                      width="20%"
                      style={{ minWidth: 100 }}
                      align="right"
                    >
                      #
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="inherit">
                            {product.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleRemoveProductInShoppingCart(index)
                            }
                          >
                            <DeleteIcon fontSize="inherit" color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <ControlledTextField
                          name={`products.${index}.amount`}
                          control={control}
                          variant="outlined"
                          size="small"
                          type="number"
                          label="Quantidade"
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {fields.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        Nenhum Produto Selecionado
                      </TableCell>
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
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={addExpenseMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddExpenseDialog;
