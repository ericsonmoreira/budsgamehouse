import AutocompleteProducts from "@/components/AutocompleteProducts";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useProducts from "@/hooks/useProducts";
import { DeleteIcon, SaveIcon } from "@/icons";
import addExpense from "@/resources/expenses/addExpense";
import { auth } from "@/services/firebaseConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Grid2 as Grid,
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
import { Timestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import schema, { AddExpenseDialogFormData } from "./schema";
import updateProductStock from "@/resources/products/updateProductStock";
import { format } from "date-fns";

const defaultValues: AddExpenseDialogFormData = {
  description: "",
  name: "",
  products: [],
  value: 0,
};

function CreateExpense() {
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const { data: produtos, isLoading: isLoadingProdutos } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { handleSubmit, reset, control, watch } =
    useForm<AddExpenseDialogFormData>({
      resolver: zodResolver(schema),
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const selectedProducts = watch("products");

  const validProdutos =
    produtos && selectedProducts
      ? produtos.filter(
          (product) => !fields.some((field) => field.name === product.name),
        )
      : [];

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
        toast.success("Despesa adicionada com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleConfirmAction = (data: AddExpenseDialogFormData) => {
    addExpenseMutate(data);
  };

  return (
    <Page loading={isLoadingProdutos || addExpenseMutateIsloading}>
      <PageHeader title="Cadastrar Despesa" containsBackButton />
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleSubmit(handleConfirmAction)}
      >
        <Grid size={12}>
          <ControlledTextField
            name="name"
            control={control}
            variant="outlined"
            size="small"
            label="Nome"
            fullWidth
          />
        </Grid>
        <Grid size={12}>
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
        <Grid size={12}>
          <ControlledCurrencyTextField
            name="value"
            control={control}
            variant="outlined"
            size="small"
            label="Valor"
            fullWidth
          />
        </Grid>
        <Grid size={12}>
          <AutocompleteProducts
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            validProdutos={validProdutos}
            onClickAddProductButton={handleAddProductToShoppingCart}
          />
        </Grid>
        <Grid size={12}>
          <Typography gutterBottom>Produdos para entrada em Estoque</Typography>
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
        <Grid size={12} justifyContent="flex-end" display="flex">
          <Button variant="contained" startIcon={<SaveIcon />} type="submit">
            Salvar
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
}

export default CreateExpense;
