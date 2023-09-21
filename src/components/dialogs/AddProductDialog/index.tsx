import {
  Backdrop,
  Button,
  CircularProgress,
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import addProduct from '../../../resources/products/addProduct';
import uploadImageInStorage from '../../../resources/uploadImageInStorage';
import ImageDropZone from '../../ImageDropZone';

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

  const [file, setFile] = useState<File | null>();

  const queryClient = useQueryClient();

  const { mutate: addProductMutate, isLoading: addProductMutateIsloading } =
    useMutation({
      mutationFn: async ({ name, price, category }: Omit<Product, 'id'>) => {
        let imgUrl;

        if (file) {
          imgUrl = await uploadImageInStorage(file);
        }

        const card = await addProduct({ name, price, category, imgUrl });

        await queryClient.invalidateQueries(['useProducts']);

        return card;
      },
      onSuccess: () => {
        handleClose();

        toast.success('Produto adicionado com sucesso');
      },
    });

  const handleConfirmAction = (data: AddProductDialogFormData) => {
    addProductMutate(data);
  };

  const handleClose = () => {
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
            <ImageDropZone file={file} setFile={setFile} />
          </Grid>
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
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={addProductMutateIsloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
