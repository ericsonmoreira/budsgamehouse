import AddCircleIcon from "@mui/icons-material/AddCircle";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Grid,
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
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import "react-vertical-timeline-component/style.min.css";
import AutocompleteProducts from "../../components/AutocompleteProducts";
import CommandTitleName from "../../components/CommandCard/CommandTitleName";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import useCommand from "../../hooks/useCommand";
import useProducts from "../../hooks/useProducts";
import updateCommand from "../../resources/commands/updateCommand";
import updateProductStock from "../../resources/products/updateProductStock";
import addSale from "../../resources/sales/addSale";
import routesNames from "../../routes/routesNames";
import { auth } from "../../services/firebaseConfig";
import { formatterCurrencyBRL } from "../../utils/formatters";
import useConfirmation from "../../hooks/useConfirmation";

type ViewCommandParams = {
  id: string;
};

type CommandItemShoppingCart = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

const ViewCommand: React.FC = () => {
  const [user] = useAuthState(auth);

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const queryClient = useQueryClient();

  const { id } = useParams<ViewCommandParams>();

  const {
    data: command,
    isLoading: commandIsLoading,
    error: commandError,
  } = useCommand(id);

  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<
    { id: string; name: string; amount: number; price: number }[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const commandIsClosed = useMemo(() => {
    if (command) {
      return command.status === "closed";
    }

    return false;
  }, [command]);

  const commandIsCanceled = useMemo(() => {
    if (command) {
      return command.status === "canceled";
    }

    return false;
  }, [command]);

  const isDisableCommandEdition = useMemo(
    () => commandIsClosed || commandIsCanceled,
    [commandIsClosed, commandIsCanceled],
  );

  const validProdutos = useMemo(() => {
    if (produtos && shoppingCart) {
      return produtos.filter(
        (product) => !shoppingCart.some((elem) => elem.id === product.id),
      );
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

  const handleMinusOneProductInShoppingCart = (
    row: CommandItemShoppingCart,
  ) => {
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
    return shoppingCart.reduce(
      (acc, curr) => acc + curr.price * curr.amount,
      0,
    );
  }, [shoppingCart]);

  const {
    mutate: updateCommandMutate,
    isPending: updateCommandMutateIsloading,
  } = useMutation({
    mutationFn: async () => {
      if (command) {
        await updateCommand({
          ...command,
          products: shoppingCart.map(({ amount, id, name, price }) => ({
            amount,
            id,
            name,
            price,
          })),
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["useCommands", "open"] }),
          queryClient.invalidateQueries({
            queryKey: ["useCommands", "closed"],
          }),
          queryClient.invalidateQueries({ queryKey: ["useCommand", id] }),
          queryClient.invalidateQueries({ queryKey: ["useProducts"] }),
          queryClient.invalidateQueries({ queryKey: ["useSales"] }),
        ]);
      }
    },
    onSuccess: () => {
      toast.success("Comanda Salva com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: closeCommandMutate, isPending: closeCommandMutateIsloading } =
    useMutation({
      mutationFn: async (): Promise<boolean> => {
        const confirmation = await showDialog({
          title: "Confirmarção",
          message: "Deseja realmente FECHAR essa Comanda?",
        });

        if (!confirmation) {
          return false;
        }

        if (command && user) {
          await updateCommand({ ...command, status: "closed" });

          // Atualiza todos os produtos de acorodo com a quantidade para remover do estoque
          await Promise.all(
            shoppingCart.map(({ id, amount }) =>
              updateProductStock(id, -amount),
            ),
          );

          // // Criando uma nova compra
          await addSale({
            createdAt: Timestamp.now(),
            playerId: "",
            products: shoppingCart.map(({ id, name, amount, price }) => ({
              id,
              name,
              amount,
              price,
            })),
            userId: user.uid,
          });

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["useCommands", "open"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["useCommands", "closed"],
            }),
            queryClient.invalidateQueries({ queryKey: ["useCommand", id] }),
            queryClient.invalidateQueries({ queryKey: ["useProducts"] }),
            queryClient.invalidateQueries({ queryKey: ["useSales"] }),
          ]);
        } else {
          throw new Error("Usuário não cadastrado");
        }

        return true;
      },
      onSuccess: (data) => {
        if (data) {
          toast.success("Comanda Fechada com sucesso");
        }
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  // TODO: ajustando aqui

  const {
    mutate: cancelCommandMutate,
    isPending: cancelCommandMutateIsloading,
  } = useMutation({
    mutationFn: async (): Promise<boolean> => {
      const confirmation = await showDialog({
        title: "Confirmarção",
        message: "Deseja realmente CANCELAR essa Comanda?",
      });

      if (!confirmation) {
        return false;
      }

      if (command) {
        await updateCommand({ ...command, status: "canceled" });
      }

      await queryClient.invalidateQueries({
        queryKey: ["useCommands", "open"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["useCommands", "canceled"],
      });

      await queryClient.invalidateQueries({ queryKey: ["useCommand", id] });

      return true;
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Comanda Cancelada com sucesso");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const isLoading = useMemo(
    () =>
      commandIsLoading ||
      updateCommandMutateIsloading ||
      closeCommandMutateIsloading ||
      cancelCommandMutateIsloading,
    [
      commandIsLoading,
      updateCommandMutateIsloading,
      closeCommandMutateIsloading || cancelCommandMutateIsloading,
    ],
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
            <>
              <Grid item xs={12}>
                <Typography color="text.primary" variant="h5">
                  Cliente: {command.displayName || "Não Informado"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CommandTitleName command={command} />
              </Grid>
            </>
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
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography variant="inherit">
                              {row.name}
                            </Typography>
                            {!isDisableCommandEdition && (
                              <Stack direction="row">
                                <IconButton
                                  onClick={() =>
                                    handlePlusOneProductInShoppingCart(row)
                                  }
                                >
                                  <AddCircleIcon
                                    fontSize="inherit"
                                    color="success"
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleMinusOneProductInShoppingCart(row)
                                  }
                                >
                                  <RemoveCircleIcon
                                    fontSize="inherit"
                                    color="error"
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleRemoveProductInShoppingCart(row)
                                  }
                                >
                                  <DeleteIcon
                                    fontSize="inherit"
                                    color="error"
                                  />
                                </IconButton>
                              </Stack>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right">
                          {formatterCurrencyBRL.format(row.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatterCurrencyBRL.format(row.amount * row.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
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
      <ConfirmationDialog />
    </Page>
  );
};

export default ViewCommand;
