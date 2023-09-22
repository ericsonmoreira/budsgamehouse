import { yupResolver } from '@hookform/resolvers/yup';
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
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import addProduct from '../../../../resources/products/addProduct';
import uploadImageInStorage from '../../../../resources/uploadImageInStorage';
import ImageDropZone from '../../../ImageDropZone';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema';

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

const AddProductDialog: React.FC<AddProductDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const { handleSubmit, reset, control } = useForm<AddProductDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: categories[0],
      price: 0,
    },
  });

  const [file, setFile] = useState<File | null>();

  const queryClient = useQueryClient();

  const { mutate: addProductMutate, isLoading: addProductMutateIsloading } = useMutation({
    mutationFn: async ({ name, price, category }: Omit<Product, 'id'>) => {
      if (file) {
        const imgUrl = await uploadImageInStorage(file);

        await addProduct({ name, price, category, imgUrl });
      } else {
        await addProduct({ name, price, category, imgUrl: '' });
      }

      await queryClient.invalidateQueries(['useProducts']);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = (data: AddProductDialogFormData) => {
    addProductMutate(data);
  };

  const handleClose = () => {
    reset({
      name: '',
      category: '',
      price: 0,
    });

    setFile(null);

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
            <ControlledTextField
              name="name"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Nome do Produto',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="category"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Categoria',
                fullWidth: true,
                select: true,
              }}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </ControlledTextField>
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="price"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Preço',
                fullWidth: true,
                type: 'number',
              }}
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
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={addProductMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddProductDialog;
