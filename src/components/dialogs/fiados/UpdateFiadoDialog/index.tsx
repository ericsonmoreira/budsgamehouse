import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@mui/material';
import { useMemo, useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import { formatterCurrencyBRL } from '../../../../utils/formatters';

type ItemShoppingCart = {
  amount: number;
} & Product;

type UpdateFiadoDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fiadoToUpdate: Fiado;
};

const UpdateFiadoDialog: React.FC<UpdateFiadoDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const { data: produtos } = useProducts();

  const [shoppingCart, setShoppingCart] = useState<ItemShoppingCart[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProductToShoppingCart = () => {
    console.log(selectedProduct);

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
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Stack direction="row" spacing={2} mb={2}>
          <Autocomplete
            value={selectedProduct}
            options={produtos ?? []}
            onChange={(_, newValue) => {
              setSelectedProduct(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            fullWidth
            renderInput={(params) => <TextField {...params} ref={null} size="small" label="Produtos" />}
          />
          <Button variant="contained" disabled={!selectedProduct} onClick={handleAddProductToShoppingCart}>
            Adicionar
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Valor Unit.</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shoppingCart.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(row.price)}</TableCell>
                  <TableCell align="right">{formatterCurrencyBRL.format(row.amount * row.price)}</TableCell>
                </TableRow>
              ))}
              {shoppingCart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>Nenhum Produto</TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total a Pagar</TableCell>
                <TableCell align="right" colSpan={3}>
                  {formatterCurrencyBRL.format(totalToPay)}
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
        <Button autoFocus>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFiadoDialog;
