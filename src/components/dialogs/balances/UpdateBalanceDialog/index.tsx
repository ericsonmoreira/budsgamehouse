import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
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
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import useProducts from "../../../../hooks/useProducts";
import updatePlayer from "../../../../resources/players/updatePlayer";
import updateProduct from "../../../../resources/products/updateProduct";
import addSale from "../../../../resources/sales/addSale";
import { auth } from "../../../../services/firebaseConfig";
import { formatterCurrencyBRL } from "../../../../utils/formatters";
import AutocompleteProducts from "../../../AutocompleteProducts";
import AvatarPlayer from "../../../AvatarPlayer";
import TypographyBalance from "../../../TypographyBalance";
import { PLAYER_LIMIT } from "../../../../utils/constants";

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

  const [user] = useAuthState(auth);

  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<ItemShoppingCart[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const totalToPay = useMemo(
    () => shoppingCart.reduce((acc, curr) => acc + curr.amount * curr.price, 0),
    [shoppingCart],
  );

  const handleClose = () => {
    setOpen(false);

    setSelectedProduct(null);

    setShoppingCart([]);
  };

  const handlePlusOneProductInShoppingCart = (row: ItemShoppingCart) => {
    const index = shoppingCart.findIndex((elem) => elem.id === row.id);

    if (index >= 0) {
      const newArray = [...shoppingCart];

      newArray[index].amount = newArray[index].amount + 1;

      setShoppingCart(newArray);
    }
  };

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

  const { mutate: updateFiadoMutate, isPending: updateFiadoMutateIsloading } =
    useMutation({
      mutationFn: async () => {
        if (user) {
          await updatePlayer({
            ...playerToUpdate,
            balance: playerToUpdate.balance - totalToPay,
          });

          // Atualiza todos os produtos de acorodo com a quantidade para remover do estoque
          await Promise.all(
            shoppingCart.map(
              ({ amount, category, id, name, price, stock, imgUrl }) =>
                updateProduct({
                  id,
                  category,
                  name,
                  price,
                  stock: stock - amount,
                  imgUrl,
                }),
            ),
          );

          // Criando uma nova compra
          await addSale({
            createdAt: Timestamp.now(),
            playerId: playerToUpdate.id,
            products: shoppingCart.map(({ id, name, amount, price }) => ({
              id,
              name,
              amount,
              price,
            })),
            userId: user.uid,
          });

          await queryClient.invalidateQueries({ queryKey: ["useProducts"] });

          await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

          await queryClient.invalidateQueries({ queryKey: ["useSales"] });

          await queryClient.invalidateQueries({
            queryKey: ["useSalesFromPlayer", playerToUpdate.id],
          });
        } else {
          throw new Error("Usuário não encontrado.");
        }
      },
      onSuccess: () => {
        handleClose();

        toast.success("Produto adicionado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const playerToUpdateIsExceededLimit = playerToUpdate.balance <= -PLAYER_LIMIT;

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        {playerToUpdateIsExceededLimit && (
          <Typography variant="h5" color="error">
            Player com limite excedido. Não é possível efetuar uma venda para
            esse Player
          </Typography>
        )}
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarPlayer playerId={playerToUpdate.id} />
              <Typography variant="h4">{playerToUpdate.name}</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <TypographyBalance
                variant="h4"
                balance={playerToUpdate.balance}
              />
              <ArrowForwardIcon fontSize="large" />
              <TypographyBalance
                variant="h4"
                balance={playerToUpdate.balance - totalToPay}
              />
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} my={2}>
          <AutocompleteProducts
            validProdutos={validProdutos}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onClickAddProductButton={handleAddProductToShoppingCart}
            disabled={playerToUpdateIsExceededLimit}
          />
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ flex: 1 }}>Produto</TableCell>
                <TableCell width="10%" style={{ minWidth: 20 }} align="right">
                  #
                </TableCell>
                <TableCell width="10%" style={{ minWidth: 100 }} align="right">
                  V. Unit.
                </TableCell>
                <TableCell width="10%" style={{ minWidth: 100 }} align="right">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shoppingCart.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="inherit">{row.name}</Typography>
                      <Stack direction="row">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handlePlusOneProductInShoppingCart(row)
                          }
                        >
                          <AddCircleIcon fontSize="inherit" color="success" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleMinusOneProductInShoppingCart(row)
                          }
                        >
                          <RemoveCircleIcon fontSize="inherit" color="error" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveProductInShoppingCart(row)}
                        >
                          <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                      </Stack>
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
              {shoppingCart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum Produto Selecionado</TableCell>
                </TableRow>
              )}
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
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          disabled={totalToPay <= 0 || playerToUpdateIsExceededLimit}
          onClick={() => updateFiadoMutate()}
        >
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updateFiadoMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdateBalanceDialog;
