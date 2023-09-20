import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type AddProductDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddProductDialogFormData = {
  name: string;
  price: number;
  category: string;
};

const categories = ['Alimentício', 'Bebida Alcoólica', 'Bebida não Alcoólica'];

const AddProductDialog: React.FC<AddProductDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { register, handleSubmit, reset } = useForm<AddProductDialogFormData>();

  const handleConfirmAction = (data: AddProductDialogFormData) => {
    console.log(data);

    try {
      toast.success('Produto adicionado com sucesso');
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  const handleCancelAction = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('name')}
              label="Nome do Produto"
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('category')}
              select
              label="Nome do Produto"
              variant="outlined"
              size="small"
              defaultValue={categories[0]}
              fullWidth
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('price')}
              fullWidth
              type="number"
              size="small"
              label="Preço"
              variant="outlined"
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCancelAction}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
