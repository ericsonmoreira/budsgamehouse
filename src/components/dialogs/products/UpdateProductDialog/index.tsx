import ImageDropZone from "@/components/ImageDropZone";
import ControlledCurrencyTextField from "@/components/textfields/ControlledCurrencyTextField";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import updateProduct from "@/resources/products/updateProduct";
import uploadImageInStorage from "@/resources/uploadImageInStorage";
import { PRODUCT_CATEGORIES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Grid2 as Grid,
  MenuItem,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import schema, { UpdateProductDialogFormData } from "./schema ";

type UpdateProductDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productToUpdate: Product;
};

const UpdateProductDialog: React.FC<UpdateProductDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  productToUpdate,
  ...rest
}) => {
  const { id, name, category, price, imgUrl, stock } = productToUpdate;

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<UpdateProductDialogFormData>(
    {
      resolver: zodResolver(schema),
    },
  );

  const [file, setFile] = useState<File | null>();

  const {
    mutate: updateProductMutate,
    isPending: updateProductMutateIsloading,
  } = useMutation({
    mutationFn: async ({
      name,
      price,
      category,
      stock,
      imgUrl,
    }: Omit<Product, "id">) => {
      if (file) {
        const newImgUrl = await uploadImageInStorage(file);

        await updateProduct({
          id,
          name,
          price,
          category,
          stock,
          imgUrl: newImgUrl,
        });
      } else {
        await updateProduct({ id, name, price, category, stock, imgUrl });
      }

      await queryClient.invalidateQueries({ queryKey: ["useProducts"] });
    },
    onSuccess: () => {
      handleClose();

      toast.success("Produto atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = (data: UpdateProductDialogFormData) => {
    updateProductMutate({ ...data, imgUrl });
  };

  const handleClose = () => {
    reset({
      name: "",
      category: "",
      price: 0,
      stock: 0,
    });

    setFile(null);

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    reset({
      name,
      category,
      price,
      stock,
    });
  }, [productToUpdate]);

  return (
    <Dialog fullScreen {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ImageDropZone file={file} setFile={setFile} />
          </Grid>
          <Grid size={12}>
            <ControlledTextField
              name="name"
              control={control}
              variant="outlined"
              size="small"
              label="Nome do Produto"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <ControlledTextField
              name="category"
              control={control}
              variant="outlined"
              size="small"
              label="Categoria"
              fullWidth
              select
            >
              {PRODUCT_CATEGORIES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </ControlledTextField>
          </Grid>
          <Grid size={12}>
            <ControlledCurrencyTextField
              name="price"
              control={control}
              variant="outlined"
              size="small"
              label="Preço"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <ControlledTextField
              name="stock"
              control={control}
              variant="outlined"
              size="small"
              label="Quantidade em Estoque"
              fullWidth
              type="number"
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
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updateProductMutateIsloading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default UpdateProductDialog;
